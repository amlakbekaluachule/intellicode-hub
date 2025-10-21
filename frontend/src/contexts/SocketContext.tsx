import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from './AuthContext'

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  joinProject: (projectId: string) => void
  leaveProject: (projectId: string) => void
  sendCodeChange: (projectId: string, filePath: string, content: string) => void
  sendCursorPosition: (projectId: string, filePath: string, position: any) => void
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

interface SocketProviderProps {
  children: ReactNode
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated && user) {
      const newSocket = io(import.meta.env.VITE_WS_URL || 'ws://localhost:5000', {
        auth: {
          token: localStorage.getItem('auth_token'),
          userId: user.id,
        },
      })

      newSocket.on('connect', () => {
        setIsConnected(true)
        console.log('Connected to WebSocket server')
      })

      newSocket.on('disconnect', () => {
        setIsConnected(false)
        console.log('Disconnected from WebSocket server')
      })

      newSocket.on('error', (error) => {
        console.error('Socket error:', error)
      })

      setSocket(newSocket)

      return () => {
        newSocket.close()
      }
    }
  }, [isAuthenticated, user])

  const joinProject = (projectId: string) => {
    if (socket) {
      socket.emit('join-project', projectId)
    }
  }

  const leaveProject = (projectId: string) => {
    if (socket) {
      socket.emit('leave-project', projectId)
    }
  }

  const sendCodeChange = (projectId: string, filePath: string, content: string) => {
    if (socket) {
      socket.emit('code-change', {
        projectId,
        filePath,
        content,
        userId: user?.id,
      })
    }
  }

  const sendCursorPosition = (projectId: string, filePath: string, position: any) => {
    if (socket) {
      socket.emit('cursor-position', {
        projectId,
        filePath,
        position,
        userId: user?.id,
      })
    }
  }

  const value: SocketContextType = {
    socket,
    isConnected,
    joinProject,
    leaveProject,
    sendCodeChange,
    sendCursorPosition,
  }

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}
