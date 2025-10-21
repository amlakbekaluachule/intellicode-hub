import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Button,
  useColorModeValue,
  Divider,
  IconButton,
  Badge,
  useDisclosure,
} from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import {
  Play,
  Save,
  FolderOpen,
  Settings,
  Brain,
  Users,
  GitBranch,
  Eye,
  EyeOff,
} from 'lucide-react'
import MonacoEditor from '@monaco-editor/react'
import { useSocket } from '../contexts/SocketContext'
import { useAuth } from '../contexts/AuthContext'
import FileExplorer from '../components/FileExplorer'
import AIPanel from '../components/AIPanel'
import CollaborationPanel from '../components/CollaborationPanel'
import { EditorState } from '../types/editor'

const Editor: React.FC = () => {
  const { projectId } = useParams()
  const { user } = useAuth()
  const { socket, isConnected, joinProject, sendCodeChange } = useSocket()
  const { isOpen: isAIPanelOpen, onToggle: toggleAIPanel } = useDisclosure()
  const { isOpen: isCollabPanelOpen, onToggle: toggleCollabPanel } = useDisclosure()
  
  const [editorState, setEditorState] = useState<EditorState>({
    activeFile: null,
    openFiles: [],
    cursorPosition: { line: 1, column: 1 },
    selection: { startLine: 1, startColumn: 1, endLine: 1, endColumn: 1 },
    theme: 'dark',
    fontSize: 14,
    tabSize: 2,
    wordWrap: false,
    minimap: true,
  })

  const [currentCode, setCurrentCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const editorRef = useRef<any>(null)

  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const sidebarBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  useEffect(() => {
    if (projectId && isConnected) {
      joinProject(projectId)
    }
  }, [projectId, isConnected, joinProject])

  useEffect(() => {
    if (socket) {
      socket.on('code-change', (data) => {
        if (data.userId !== user?.id && data.projectId === projectId) {
          setCurrentCode(data.content)
        }
      })

      socket.on('cursor-position', (data) => {
        // Handle cursor position updates from other users
        console.log('Cursor position update:', data)
      })

      return () => {
        socket.off('code-change')
        socket.off('cursor-position')
      }
    }
  }, [socket, projectId, user?.id])

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCurrentCode(value)
      if (projectId) {
        sendCodeChange(projectId, editorState.activeFile || '', value)
      }
    }
  }

  const handleEditorMount = (editor: any) => {
    editorRef.current = editor
    
    // Configure editor options
    editor.updateOptions({
      fontSize: editorState.fontSize,
      tabSize: editorState.tabSize,
      wordWrap: editorState.wordWrap ? 'on' : 'off',
      minimap: { enabled: editorState.minimap },
      theme: editorState.theme === 'dark' ? 'vs-dark' : 'vs',
    })

    // Add AI completion provider
    editor.addAction({
      id: 'ai-complete',
      label: 'AI Complete',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space],
      run: () => {
        // Trigger AI completion
        console.log('AI completion triggered')
      },
    })
  }

  const handleSave = () => {
    // Save current file
    console.log('Saving file:', editorState.activeFile)
  }

  const handleRun = () => {
    // Run the current code
    console.log('Running code')
  }

  const getLanguageFromFile = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase()
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

  return (
    <Box h="100vh" bg={bgColor}>
      <Flex h="full">
        {/* File Explorer Sidebar */}
        <Box w="300px" bg={sidebarBg} borderRight="1px" borderColor={borderColor}>
          <FileExplorer
            projectId={projectId}
            activeFile={editorState.activeFile}
            onFileSelect={(filePath) => {
              setEditorState(prev => ({ ...prev, activeFile: filePath }))
            }}
          />
        </Box>

        {/* Main Editor Area */}
        <Flex direction="column" flex="1">
          {/* Editor Toolbar */}
          <HStack
            p={3}
            bg={sidebarBg}
            borderBottom="1px"
            borderColor={borderColor}
            spacing={4}
          >
            <HStack spacing={2}>
              <Button
                size="sm"
                colorScheme="blue"
                leftIcon={<Play size={16} />}
                onClick={handleRun}
              >
                Run
              </Button>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Save size={16} />}
                onClick={handleSave}
              >
                Save
              </Button>
            </HStack>

            <Divider orientation="vertical" />

            <HStack spacing={2}>
              <IconButton
                aria-label="AI Assistant"
                icon={<Brain size={16} />}
                size="sm"
                variant={isAIPanelOpen ? 'solid' : 'ghost'}
                colorScheme="purple"
                onClick={toggleAIPanel}
              />
              <IconButton
                aria-label="Collaboration"
                icon={<Users size={16} />}
                size="sm"
                variant={isCollabPanelOpen ? 'solid' : 'ghost'}
                colorScheme="green"
                onClick={toggleCollabPanel}
              />
              <IconButton
                aria-label="Settings"
                icon={<Settings size={16} />}
                size="sm"
                variant="ghost"
              />
            </HStack>

            <Box flex="1" />

            <HStack spacing={2}>
              <Badge colorScheme={isConnected ? 'green' : 'red'} variant="subtle">
                {isConnected ? 'Connected' : 'Disconnected'}
              </Badge>
              <Text fontSize="sm" color="gray.500">
                {editorState.activeFile || 'No file selected'}
              </Text>
            </HStack>
          </HStack>

          {/* Editor Content */}
          <Flex flex="1">
            <Box flex="1">
              <MonacoEditor
                height="100%"
                language={getLanguageFromFile(editorState.activeFile || '')}
                value={currentCode}
                onChange={handleEditorChange}
                onMount={handleEditorMount}
                theme={editorState.theme === 'dark' ? 'vs-dark' : 'vs'}
                options={{
                  fontSize: editorState.fontSize,
                  tabSize: editorState.tabSize,
                  wordWrap: editorState.wordWrap ? 'on' : 'off',
                  minimap: { enabled: editorState.minimap },
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  renderWhitespace: 'selection',
                  cursorBlinking: 'smooth',
                  cursorSmoothCaretAnimation: true,
                  smoothScrolling: true,
                  contextmenu: true,
                  mouseWheelZoom: true,
                  suggest: {
                    showKeywords: true,
                    showSnippets: true,
                    showFunctions: true,
                    showConstructors: true,
                    showFields: true,
                    showVariables: true,
                    showClasses: true,
                    showStructs: true,
                    showInterfaces: true,
                    showModules: true,
                    showProperties: true,
                    showEvents: true,
                    showOperators: true,
                    showUnits: true,
                    showValues: true,
                    showConstants: true,
                    showEnums: true,
                    showEnumMembers: true,
                    showColors: true,
                    showFiles: true,
                    showReferences: true,
                    showFolders: true,
                    showTypeParameters: true,
                    showIssues: true,
                    showUsers: true,
                    showWords: true,
                  },
                }}
              />
            </Box>

            {/* AI Panel */}
            {isAIPanelOpen && (
              <Box w="400px" bg={sidebarBg} borderLeft="1px" borderColor={borderColor}>
                <AIPanel
                  code={currentCode}
                  language={getLanguageFromFile(editorState.activeFile || '')}
                  onClose={toggleAIPanel}
                />
              </Box>
            )}

            {/* Collaboration Panel */}
            {isCollabPanelOpen && (
              <Box w="300px" bg={sidebarBg} borderLeft="1px" borderColor={borderColor}>
                <CollaborationPanel
                  projectId={projectId}
                  onClose={toggleCollabPanel}
                />
              </Box>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Box>
  )
}

export default Editor
