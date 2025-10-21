import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import { prisma } from '../config/database'
import { logger } from '../utils/logger'

interface AuthenticatedSocket extends Socket {
  userId?: string
  user?: {
    id: string
    name: string
    email: string
  }
}

interface Socket extends any {
  userId?: string
  user?: {
    id: string
    name: string
    email: string
  }
}

export const socketHandler = (io: Server) => {
  // Authentication middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'))
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true
        }
      })

      if (!user) {
        return next(new Error('Authentication error: User not found'))
      }

      socket.userId = user.id
      socket.user = user
      next()
    } catch (error) {
      logger.error('Socket authentication error:', error)
      next(new Error('Authentication error: Invalid token'))
    }
  })

  io.on('connection', (socket: AuthenticatedSocket) => {
    logger.info(`User connected: ${socket.user?.name} (${socket.id})`)

    // Join project room
    socket.on('join-project', async (projectId: string) => {
      try {
        // Verify user has access to this project
        const project = await prisma.project.findFirst({
          where: {
            id: projectId,
            OR: [
              { ownerId: socket.userId },
              { collaborations: { some: { userId: socket.userId } } }
            ]
          }
        })

        if (!project) {
          socket.emit('error', { message: 'Access denied to project' })
          return
        }

        socket.join(`project:${projectId}`)
        
        // Notify others in the project
        socket.to(`project:${projectId}`).emit('user-joined', {
          userId: socket.userId,
          userName: socket.user?.name,
          userAvatar: socket.user?.avatar
        })

        // Get current collaborators
        const collaborators = await prisma.collaboration.findMany({
          where: { projectId },
          include: {
            user: {
              select: { id: true, name: true, avatar: true }
            }
          }
        })

        socket.emit('collaborators-updated', collaborators.map(c => ({
          id: c.user.id,
          name: c.user.name,
          avatar: c.user.avatar,
          role: c.role,
          isOnline: true // This would be tracked in a real implementation
        })))

        logger.info(`User ${socket.user?.name} joined project ${projectId}`)
      } catch (error) {
        logger.error('Join project error:', error)
        socket.emit('error', { message: 'Failed to join project' })
      }
    })

    // Leave project room
    socket.on('leave-project', (projectId: string) => {
      socket.leave(`project:${projectId}`)
      
      // Notify others in the project
      socket.to(`project:${projectId}`).emit('user-left', {
        userId: socket.userId,
        userName: socket.user?.name
      })

      logger.info(`User ${socket.user?.name} left project ${projectId}`)
    })

    // Handle code changes
    socket.on('code-change', async (data: {
      projectId: string
      filePath: string
      content: string
      userId: string
    }) => {
      try {
        const { projectId, filePath, content, userId } = data

        // Verify user has access to this project
        const project = await prisma.project.findFirst({
          where: {
            id: projectId,
            OR: [
              { ownerId: userId },
              { 
                collaborations: { 
                  some: { 
                    userId: userId, 
                    role: { in: ['OWNER', 'EDITOR'] }
                  }
                }
              }
            ]
          }
        })

        if (!project) {
          socket.emit('error', { message: 'Access denied to project' })
          return
        }

        // Update file in database
        await prisma.projectFile.upsert({
          where: {
            projectId_path: {
              projectId,
              path: filePath
            }
          },
          update: {
            content,
            size: content.length,
            updatedAt: new Date()
          },
          create: {
            name: filePath.split('/').pop() || filePath,
            path: filePath,
            content,
            language: getLanguageFromPath(filePath),
            size: content.length,
            projectId
          }
        })

        // Update project's lastModified timestamp
        await prisma.project.update({
          where: { id: projectId },
          data: { lastModified: new Date() }
        })

        // Broadcast to other users in the project
        socket.to(`project:${projectId}`).emit('code-change', {
          filePath,
          content,
          userId,
          userName: socket.user?.name,
          timestamp: new Date().toISOString()
        })

        logger.debug(`Code change in project ${projectId}, file ${filePath} by ${socket.user?.name}`)
      } catch (error) {
        logger.error('Code change error:', error)
        socket.emit('error', { message: 'Failed to update code' })
      }
    })

    // Handle cursor position updates
    socket.on('cursor-position', async (data: {
      projectId: string
      filePath: string
      position: { line: number; column: number }
      userId: string
    }) => {
      try {
        const { projectId, filePath, position, userId } = data

        // Update cursor position in database
        await prisma.cursorPosition.upsert({
          where: {
            userId_projectId_filePath: {
              userId,
              projectId,
              filePath
            }
          },
          update: {
            line: position.line,
            column: position.column,
            updatedAt: new Date()
          },
          create: {
            userId,
            projectId,
            filePath,
            line: position.line,
            column: position.column
          }
        })

        // Broadcast to other users in the project
        socket.to(`project:${projectId}`).emit('cursor-position', {
          userId,
          userName: socket.user?.name,
          filePath,
          position,
          timestamp: new Date().toISOString()
        })
      } catch (error) {
        logger.error('Cursor position error:', error)
      }
    })

    // Handle chat messages
    socket.on('chat-message', async (data: {
      projectId: string
      message: string
    }) => {
      try {
        const { projectId, message } = data

        // Verify user has access to this project
        const project = await prisma.project.findFirst({
          where: {
            id: projectId,
            OR: [
              { ownerId: socket.userId },
              { collaborations: { some: { userId: socket.userId } } }
            ]
          }
        })

        if (!project) {
          socket.emit('error', { message: 'Access denied to project' })
          return
        }

        // Save message to database
        const chatMessage = await prisma.chatMessage.create({
          data: {
            userId: socket.userId!,
            projectId,
            message,
            type: 'MESSAGE'
          },
          include: {
            user: {
              select: { id: true, name: true, avatar: true }
            }
          }
        })

        // Broadcast to all users in the project
        io.to(`project:${projectId}`).emit('chat-message', {
          id: chatMessage.id,
          userId: chatMessage.userId,
          userName: chatMessage.user.name,
          userAvatar: chatMessage.user.avatar,
          message: chatMessage.message,
          timestamp: chatMessage.createdAt.toISOString(),
          type: chatMessage.type
        })

        logger.info(`Chat message in project ${projectId} by ${socket.user?.name}`)
      } catch (error) {
        logger.error('Chat message error:', error)
        socket.emit('error', { message: 'Failed to send message' })
      }
    })

    // Handle typing indicators
    socket.on('typing-start', (data: { projectId: string; filePath: string }) => {
      socket.to(`project:${data.projectId}`).emit('user-typing', {
        userId: socket.userId,
        userName: socket.user?.name,
        filePath: data.filePath,
        isTyping: true
      })
    })

    socket.on('typing-stop', (data: { projectId: string; filePath: string }) => {
      socket.to(`project:${data.projectId}`).emit('user-typing', {
        userId: socket.userId,
        userName: socket.user?.name,
        filePath: data.filePath,
        isTyping: false
      })
    })

    // Handle disconnect
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.user?.name} (${socket.id})`)
    })
  })

  // Helper function to determine language from file path
  function getLanguageFromPath(path: string): string {
    const ext = path.split('.').pop()?.toLowerCase()
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'cs': 'csharp',
      'go': 'go',
      'rs': 'rust',
      'php': 'php',
      'rb': 'ruby',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'json': 'json',
      'xml': 'xml',
      'yaml': 'yaml',
      'yml': 'yaml',
      'md': 'markdown',
      'sql': 'sql',
    }
    return languageMap[ext || ''] || 'plaintext'
  }
}
