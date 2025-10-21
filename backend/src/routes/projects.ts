import { Router } from 'express'
import { body, param, validationResult } from 'express-validator'
import { prisma } from '../config/database'
import { authenticate, AuthRequest } from '../middleware/auth'
import { logger } from '../utils/logger'

const router = Router()

// Get all projects for the authenticated user
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: req.user!.id },
          { collaborations: { some: { userId: req.user!.id } } }
        ]
      },
      include: {
        owner: {
          select: { id: true, name: true, avatar: true }
        },
        files: {
          select: { id: true, name: true, path: true, language: true, size: true }
        },
        collaborations: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true }
            }
          }
        },
        _count: {
          select: { files: true, collaborations: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    res.json({
      success: true,
      data: projects
    })
  } catch (error) {
    logger.error('Get projects error:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch projects' }
    })
  }
})

// Get a specific project
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    const project = await prisma.project.findFirst({
      where: {
        id,
        OR: [
          { ownerId: req.user!.id },
          { collaborations: { some: { userId: req.user!.id } } }
        ]
      },
      include: {
        owner: {
          select: { id: true, name: true, avatar: true }
        },
        files: {
          orderBy: { path: 'asc' }
        },
        collaborations: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true }
            }
          }
        }
      }
    })

    if (!project) {
      return res.status(404).json({
        success: false,
        error: { message: 'Project not found' }
      })
    }

    res.json({
      success: true,
      data: project
    })
  } catch (error) {
    logger.error('Get project error:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch project' }
    })
  }
})

// Create a new project
router.post('/', authenticate, [
  body('name').trim().isLength({ min: 1 }).withMessage('Project name is required'),
  body('description').optional().trim(),
  body('isPublic').optional().isBoolean()
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: errors.array() }
      })
    }

    const { name, description, isPublic = false } = req.body

    const project = await prisma.project.create({
      data: {
        name,
        description,
        isPublic,
        ownerId: req.user!.id,
        files: {
          create: [
            {
              name: 'README.md',
              path: 'README.md',
              content: `# ${name}\n\n${description || 'A new project created with IntelliCode Hub'}`,
              language: 'markdown',
              size: 0,
              isDirectory: false
            }
          ]
        }
      },
      include: {
        owner: {
          select: { id: true, name: true, avatar: true }
        },
        files: true,
        collaborations: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true }
            }
          }
        }
      }
    })

    logger.info(`New project created: ${project.name} by ${req.user!.email}`)

    res.status(201).json({
      success: true,
      data: project
    })
  } catch (error) {
    logger.error('Create project error:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create project' }
    })
  }
})

// Update a project
router.put('/:id', authenticate, [
  body('name').optional().trim().isLength({ min: 1 }),
  body('description').optional().trim(),
  body('isPublic').optional().isBoolean()
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: errors.array() }
      })
    }

    const { id } = req.params
    const { name, description, isPublic } = req.body

    // Check if user has permission to update this project
    const project = await prisma.project.findFirst({
      where: {
        id,
        OR: [
          { ownerId: req.user!.id },
          { 
            collaborations: { 
              some: { 
                userId: req.user!.id, 
                role: { in: ['OWNER', 'EDITOR'] }
              }
            }
          }
        ]
      }
    })

    if (!project) {
      return res.status(404).json({
        success: false,
        error: { message: 'Project not found or insufficient permissions' }
      })
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(isPublic !== undefined && { isPublic }),
        updatedAt: new Date()
      },
      include: {
        owner: {
          select: { id: true, name: true, avatar: true }
        },
        files: true,
        collaborations: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true }
            }
          }
        }
      }
    })

    res.json({
      success: true,
      data: updatedProject
    })
  } catch (error) {
    logger.error('Update project error:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update project' }
    })
  }
})

// Delete a project
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    // Check if user is the owner
    const project = await prisma.project.findFirst({
      where: {
        id,
        ownerId: req.user!.id
      }
    })

    if (!project) {
      return res.status(404).json({
        success: false,
        error: { message: 'Project not found or insufficient permissions' }
      })
    }

    await prisma.project.delete({
      where: { id }
    })

    logger.info(`Project deleted: ${project.name} by ${req.user!.email}`)

    res.json({
      success: true,
      message: 'Project deleted successfully'
    })
  } catch (error) {
    logger.error('Delete project error:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to delete project' }
    })
  }
})

// Get project files
router.get('/:id/files', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    // Check if user has access to this project
    const project = await prisma.project.findFirst({
      where: {
        id,
        OR: [
          { ownerId: req.user!.id },
          { collaborations: { some: { userId: req.user!.id } } }
        ]
      }
    })

    if (!project) {
      return res.status(404).json({
        success: false,
        error: { message: 'Project not found' }
      })
    }

    const files = await prisma.projectFile.findMany({
      where: { projectId: id },
      orderBy: { path: 'asc' }
    })

    res.json({
      success: true,
      data: files
    })
  } catch (error) {
    logger.error('Get project files error:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch project files' }
    })
  }
})

// Update project file
router.put('/:id/files', authenticate, [
  body('path').trim().isLength({ min: 1 }).withMessage('File path is required'),
  body('content').isString()
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: errors.array() }
      })
    }

    const { id } = req.params
    const { path, content } = req.body

    // Check if user has access to this project
    const project = await prisma.project.findFirst({
      where: {
        id,
        OR: [
          { ownerId: req.user!.id },
          { 
            collaborations: { 
              some: { 
                userId: req.user!.id, 
                role: { in: ['OWNER', 'EDITOR'] }
              }
            }
          }
        ]
      }
    })

    if (!project) {
      return res.status(404).json({
        success: false,
        error: { message: 'Project not found or insufficient permissions' }
      })
    }

    const file = await prisma.projectFile.upsert({
      where: {
        projectId_path: {
          projectId: id,
          path
        }
      },
      update: {
        content,
        size: content.length,
        updatedAt: new Date()
      },
      create: {
        name: path.split('/').pop() || path,
        path,
        content,
        language: getLanguageFromPath(path),
        size: content.length,
        projectId: id
      }
    })

    // Update project's lastModified timestamp
    await prisma.project.update({
      where: { id },
      data: { lastModified: new Date() }
    })

    res.json({
      success: true,
      data: file
    })
  } catch (error) {
    logger.error('Update project file error:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update file' }
    })
  }
})

// Create project file
router.post('/:id/files', authenticate, [
  body('path').trim().isLength({ min: 1 }).withMessage('File path is required'),
  body('content').optional().isString()
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: errors.array() }
      })
    }

    const { id } = req.params
    const { path, content = '' } = req.body

    // Check if user has access to this project
    const project = await prisma.project.findFirst({
      where: {
        id,
        OR: [
          { ownerId: req.user!.id },
          { 
            collaborations: { 
              some: { 
                userId: req.user!.id, 
                role: { in: ['OWNER', 'EDITOR'] }
              }
            }
          }
        ]
      }
    })

    if (!project) {
      return res.status(404).json({
        success: false,
        error: { message: 'Project not found or insufficient permissions' }
      })
    }

    const file = await prisma.projectFile.create({
      data: {
        name: path.split('/').pop() || path,
        path,
        content,
        language: getLanguageFromPath(path),
        size: content.length,
        projectId: id
      }
    })

    res.status(201).json({
      success: true,
      data: file
    })
  } catch (error) {
    logger.error('Create project file error:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create file' }
    })
  }
})

// Delete project file
router.delete('/:id/files', authenticate, [
  body('path').trim().isLength({ min: 1 }).withMessage('File path is required')
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: errors.array() }
      })
    }

    const { id } = req.params
    const { path } = req.body

    // Check if user has access to this project
    const project = await prisma.project.findFirst({
      where: {
        id,
        OR: [
          { ownerId: req.user!.id },
          { 
            collaborations: { 
              some: { 
                userId: req.user!.id, 
                role: { in: ['OWNER', 'EDITOR'] }
              }
            }
          }
        ]
      }
    })

    if (!project) {
      return res.status(404).json({
        success: false,
        error: { message: 'Project not found or insufficient permissions' }
      })
    }

    await prisma.projectFile.deleteMany({
      where: {
        projectId: id,
        path
      }
    })

    res.json({
      success: true,
      message: 'File deleted successfully'
    })
  } catch (error) {
    logger.error('Delete project file error:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to delete file' }
    })
  }
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

export { router as projectRoutes }
