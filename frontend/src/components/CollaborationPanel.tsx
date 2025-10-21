import React, { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Badge,
  useColorModeValue,
  Divider,
  IconButton,
  Button,
  Input,
  useDisclosure,
  Collapse,
} from '@chakra-ui/react'
import {
  Users,
  MessageCircle,
  Send,
  X,
  Video,
  Mic,
  MicOff,
  VideoOff,
  Settings,
  Crown,
  Edit,
  Eye,
} from 'lucide-react'
import { useSocket } from '../contexts/SocketContext'
import { useAuth } from '../contexts/AuthContext'

interface Collaborator {
  id: string
  name: string
  avatar?: string
  role: 'owner' | 'editor' | 'viewer'
  isOnline: boolean
  cursorPosition?: {
    line: number
    column: number
  }
  currentFile?: string
}

interface ChatMessage {
  id: string
  userId: string
  userName: string
  message: string
  timestamp: string
  type: 'message' | 'system'
}

interface CollaborationPanelProps {
  projectId?: string
  onClose: () => void
}

const CollaborationPanel: React.FC<CollaborationPanelProps> = ({ projectId, onClose }) => {
  const { socket } = useSocket()
  const { user } = useAuth()
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isVideoOn, setIsVideoOn] = useState(false)
  const [isMicOn, setIsMicOn] = useState(false)
  const { isOpen: isChatOpen, onToggle: toggleChat } = useDisclosure()
  
  const bgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.700', 'gray.200')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  useEffect(() => {
    if (socket) {
      // Listen for collaborator updates
      socket.on('collaborators-updated', (collaborators: Collaborator[]) => {
        setCollaborators(collaborators)
      })

      // Listen for chat messages
      socket.on('chat-message', (message: ChatMessage) => {
        setChatMessages(prev => [...prev, message])
      })

      // Listen for cursor position updates
      socket.on('cursor-position', (data: any) => {
        setCollaborators(prev => 
          prev.map(collab => 
            collab.id === data.userId 
              ? { ...collab, cursorPosition: data.position, currentFile: data.filePath }
              : collab
          )
        )
      })

      return () => {
        socket.off('collaborators-updated')
        socket.off('chat-message')
        socket.off('cursor-position')
      }
    }
  }, [socket])

  const sendMessage = () => {
    if (!newMessage.trim() || !socket) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: user?.id || '',
      userName: user?.name || 'Anonymous',
      message: newMessage,
      timestamp: new Date().toISOString(),
      type: 'message',
    }

    socket.emit('chat-message', {
      projectId,
      message,
    })

    setChatMessages(prev => [...prev, message])
    setNewMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown size={12} />
      case 'editor':
        return <Edit size={12} />
      case 'viewer':
        return <Eye size={12} />
      default:
        return null
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'yellow'
      case 'editor':
        return 'blue'
      case 'viewer':
        return 'gray'
      default:
        return 'gray'
    }
  }

  return (
    <Box h="full" bg={bgColor}>
      <VStack spacing={0} align="stretch" h="full">
        {/* Header */}
        <Box p={4} borderBottom="1px" borderColor={borderColor}>
          <HStack justify="space-between" mb={3}>
            <HStack spacing={2}>
              <Users size={20} />
              <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                Collaboration
              </Text>
              <Badge colorScheme="green" variant="subtle">
                {collaborators.length}
              </Badge>
            </HStack>
            <IconButton
              aria-label="Close collaboration panel"
              icon={<X size={16} />}
              size="sm"
              variant="ghost"
              onClick={onClose}
            />
          </HStack>
        </Box>

        {/* Collaborators */}
        <Box p={4} borderBottom="1px" borderColor={borderColor}>
          <Text fontSize="sm" fontWeight="semibold" mb={3} color={textColor}>
            Active Collaborators
          </Text>
          <VStack spacing={2} align="stretch">
            {collaborators.map((collaborator) => (
              <HStack key={collaborator.id} spacing={3}>
                <Box position="relative">
                  <Avatar
                    size="sm"
                    src={collaborator.avatar}
                    name={collaborator.name}
                    bg="blue.500"
                  />
                  <Box
                    position="absolute"
                    bottom={0}
                    right={0}
                    w={3}
                    h={3}
                    bg={collaborator.isOnline ? 'green.400' : 'gray.400'}
                    rounded="full"
                    border="2px"
                    borderColor="white"
                  />
                </Box>
                <VStack align="start" spacing={0} flex="1">
                  <HStack spacing={2}>
                    <Text fontSize="sm" fontWeight="medium" color={textColor}>
                      {collaborator.name}
                    </Text>
                    <Badge
                      size="sm"
                      colorScheme={getRoleColor(collaborator.role)}
                      variant="subtle"
                    >
                      <HStack spacing={1}>
                        {getRoleIcon(collaborator.role)}
                        <Text fontSize="xs">{collaborator.role}</Text>
                      </HStack>
                    </Badge>
                  </HStack>
                  {collaborator.currentFile && (
                    <Text fontSize="xs" color="gray.500">
                      Editing: {collaborator.currentFile}
                    </Text>
                  )}
                </VStack>
              </HStack>
            ))}
          </VStack>
        </Box>

        {/* Video Controls */}
        <Box p={4} borderBottom="1px" borderColor={borderColor}>
          <HStack justify="space-between" mb={3}>
            <Text fontSize="sm" fontWeight="semibold" color={textColor}>
              Video Call
            </Text>
            <IconButton
              aria-label="Video settings"
              icon={<Settings size={16} />}
              size="sm"
              variant="ghost"
            />
          </HStack>
          <HStack spacing={2}>
            <Button
              size="sm"
              colorScheme={isVideoOn ? 'red' : 'gray'}
              leftIcon={isVideoOn ? <Video size={16} /> : <VideoOff size={16} />}
              onClick={() => setIsVideoOn(!isVideoOn)}
            >
              {isVideoOn ? 'Stop Video' : 'Start Video'}
            </Button>
            <Button
              size="sm"
              colorScheme={isMicOn ? 'green' : 'gray'}
              leftIcon={isMicOn ? <Mic size={16} /> : <MicOff size={16} />}
              onClick={() => setIsMicOn(!isMicOn)}
            >
              {isMicOn ? 'Mute' : 'Unmute'}
            </Button>
          </HStack>
        </Box>

        {/* Chat */}
        <Box flex="1" display="flex" flexDirection="column">
          <Box p={4} borderBottom="1px" borderColor={borderColor}>
            <HStack justify="space-between">
              <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                Chat
              </Text>
              <IconButton
                aria-label="Toggle chat"
                icon={<MessageCircle size={16} />}
                size="sm"
                variant="ghost"
                onClick={toggleChat}
              />
            </HStack>
          </Box>

          <Collapse in={isChatOpen}>
            <Box flex="1" display="flex" flexDirection="column">
              {/* Chat Messages */}
              <Box flex="1" p={4} overflowY="auto" maxH="200px">
                <VStack spacing={2} align="stretch">
                  {chatMessages.map((message) => (
                    <Box
                      key={message.id}
                      p={2}
                      bg={message.userId === user?.id ? 'blue.50' : 'gray.50'}
                      rounded="md"
                      border="1px"
                      borderColor={borderColor}
                    >
                      <HStack spacing={2} mb={1}>
                        <Text fontSize="xs" fontWeight="semibold" color="blue.600">
                          {message.userName}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </Text>
                      </HStack>
                      <Text fontSize="sm" color={textColor}>
                        {message.message}
                      </Text>
                    </Box>
                  ))}
                </VStack>
              </Box>

              {/* Chat Input */}
              <Box p={4} borderTop="1px" borderColor={borderColor}>
                <HStack spacing={2}>
                  <Input
                    size="sm"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <IconButton
                    aria-label="Send message"
                    icon={<Send size={16} />}
                    size="sm"
                    colorScheme="blue"
                    onClick={sendMessage}
                    isDisabled={!newMessage.trim()}
                  />
                </HStack>
              </Box>
            </Box>
          </Collapse>
        </Box>
      </VStack>
    </Box>
  )
}

export default CollaborationPanel
