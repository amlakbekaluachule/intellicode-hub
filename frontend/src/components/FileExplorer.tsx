import React, { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  IconButton,
  useColorModeValue,
  Collapse,
  Button,
  Input,
  useDisclosure,
} from '@chakra-ui/react'
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderOpen,
  Plus,
  MoreHorizontal,
  Search,
} from 'lucide-react'
import { projectApi } from '../services/api'
import { ProjectFile } from '../types/project'

interface FileExplorerProps {
  projectId?: string
  activeFile?: string | null
  onFileSelect: (filePath: string) => void
}

interface FileItemProps {
  file: ProjectFile
  level: number
  isActive: boolean
  onSelect: (filePath: string) => void
}

const FileItem: React.FC<FileItemProps> = ({ file, level, isActive, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const textColor = useColorModeValue('gray.700', 'gray.200')
  const activeBg = useColorModeValue('blue.50', 'blue.900')
  const hoverBg = useColorModeValue('gray.100', 'gray.700')

  const isDirectory = file.isDirectory
  const hasChildren = file.children && file.children.length > 0

  const handleClick = () => {
    if (isDirectory) {
      setIsExpanded(!isExpanded)
    } else {
      onSelect(file.path)
    }
  }

  return (
    <Box>
      <HStack
        spacing={2}
        pl={level * 4}
        py={1}
        cursor="pointer"
        bg={isActive ? activeBg : 'transparent'}
        _hover={{ bg: isActive ? activeBg : hoverBg }}
        onClick={handleClick}
        transition="all 0.2s"
      >
        {isDirectory ? (
          <IconButton
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
            icon={isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            size="xs"
            variant="ghost"
            opacity={hasChildren ? 1 : 0}
          />
        ) : (
          <Box w={4} />
        )}
        
        {isDirectory ? (
          isExpanded ? <FolderOpen size={16} /> : <Folder size={16} />
        ) : (
          <File size={16} />
        )}
        
        <Text
          fontSize="sm"
          color={textColor}
          fontWeight={isActive ? 'semibold' : 'normal'}
          noOfLines={1}
        >
          {file.name}
        </Text>
        
        {!isDirectory && (
          <Text fontSize="xs" color="gray.500" ml="auto">
            {file.size} bytes
          </Text>
        )}
      </HStack>

      {isDirectory && isExpanded && file.children && (
        <VStack spacing={0} align="stretch">
          {file.children.map((child) => (
            <FileItem
              key={child.id}
              file={child}
              level={level + 1}
              isActive={child.path === file.path}
              onSelect={onSelect}
            />
          ))}
        </VStack>
      )}
    </Box>
  )
}

const FileExplorer: React.FC<FileExplorerProps> = ({ projectId, activeFile, onFileSelect }) => {
  const [files, setFiles] = useState<ProjectFile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { isOpen: isSearchOpen, onToggle: toggleSearch } = useDisclosure()
  
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const textColor = useColorModeValue('gray.700', 'gray.200')

  useEffect(() => {
    if (projectId) {
      loadFiles()
    }
  }, [projectId])

  const loadFiles = async () => {
    if (!projectId) return
    
    setIsLoading(true)
    try {
      const projectFiles = await projectApi.getProjectFiles(projectId)
      setFiles(projectFiles)
    } catch (error) {
      console.error('Failed to load files:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Box h="full" bg={bgColor}>
      <VStack spacing={0} align="stretch" h="full">
        {/* Header */}
        <Box p={3} borderBottom="1px" borderColor={borderColor}>
          <HStack justify="space-between" mb={3}>
            <Text fontSize="sm" fontWeight="semibold" color={textColor}>
              Explorer
            </Text>
            <HStack spacing={1}>
              <IconButton
                aria-label="Search files"
                icon={<Search size={16} />}
                size="sm"
                variant="ghost"
                onClick={toggleSearch}
              />
              <IconButton
                aria-label="Add file"
                icon={<Plus size={16} />}
                size="sm"
                variant="ghost"
              />
              <IconButton
                aria-label="More options"
                icon={<MoreHorizontal size={16} />}
                size="sm"
                variant="ghost"
              />
            </HStack>
          </HStack>
          
          <Collapse in={isSearchOpen}>
            <Input
              size="sm"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              mb={2}
            />
          </Collapse>
        </Box>

        {/* File Tree */}
        <Box flex="1" overflowY="auto" p={2}>
          {isLoading ? (
            <VStack spacing={2}>
              {[...Array(5)].map((_, i) => (
                <Box key={i} w="full" h={6} bg="gray.200" rounded="md" animate="pulse" />
              ))}
            </VStack>
          ) : (
            <VStack spacing={0} align="stretch">
              {filteredFiles.map((file) => (
                <FileItem
                  key={file.id}
                  file={file}
                  level={0}
                  isActive={activeFile === file.path}
                  onSelect={onFileSelect}
                />
              ))}
            </VStack>
          )}
        </Box>

        {/* Footer */}
        <Box p={3} borderTop="1px" borderColor={borderColor}>
          <Button size="sm" variant="outline" w="full" leftIcon={<Plus size={16} />}>
            New File
          </Button>
        </Box>
      </VStack>
    </Box>
  )
}

export default FileExplorer
