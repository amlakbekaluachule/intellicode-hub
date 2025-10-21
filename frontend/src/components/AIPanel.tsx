import React, { useState } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Textarea,
  useColorModeValue,
  Divider,
  Badge,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Code,
} from '@chakra-ui/react'
import {
  Brain,
  Sparkles,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  X,
  Zap,
  BookOpen,
  Wrench,
} from 'lucide-react'
import { aiApi } from '../services/api'
import { AIRequest } from '../types/editor'

interface AIPanelProps {
  code: string
  language: string
  onClose: () => void
}

const AIPanel: React.FC<AIPanelProps> = ({ code, language, onClose }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [explanation, setExplanation] = useState('')
  const [refactoredCode, setRefactoredCode] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [userPrompt, setUserPrompt] = useState('')
  
  const bgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.700', 'gray.200')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const handleExplainCode = async () => {
    if (!code.trim()) return
    
    setIsLoading(true)
    try {
      const explanation = await aiApi.getCodeExplanation(code, language)
      setExplanation(explanation)
    } catch (error) {
      console.error('Failed to get explanation:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefactorCode = async () => {
    if (!code.trim()) return
    
    setIsLoading(true)
    try {
      const refactored = await aiApi.getCodeRefactor(code, language)
      setRefactoredCode(refactored)
    } catch (error) {
      console.error('Failed to refactor code:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGetSuggestions = async () => {
    if (!code.trim()) return
    
    setIsLoading(true)
    try {
      const completions = await aiApi.getCodeCompletion(code, language, { line: 1, column: 1 })
      setSuggestions(completions)
    } catch (error) {
      console.error('Failed to get suggestions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCustomPrompt = async () => {
    if (!userPrompt.trim() || !code.trim()) return
    
    setIsLoading(true)
    try {
      const request: AIRequest = {
        type: 'generate',
        code,
        language,
        context: userPrompt,
      }
      const response = await aiApi.getSuggestion(request)
      setExplanation(response.content)
    } catch (error) {
      console.error('Failed to process custom prompt:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <Box h="full" bg={bgColor}>
      <VStack spacing={0} align="stretch" h="full">
        {/* Header */}
        <Box p={4} borderBottom="1px" borderColor={borderColor}>
          <HStack justify="space-between" mb={3}>
            <HStack spacing={2}>
              <Brain size={20} />
              <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                AI Assistant
              </Text>
              <Badge colorScheme="purple" variant="subtle">
                GPT-4
              </Badge>
            </HStack>
            <IconButton
              aria-label="Close AI panel"
              icon={<X size={16} />}
              size="sm"
              variant="ghost"
              onClick={onClose}
            />
          </HStack>
        </Box>

        {/* Content */}
        <Box flex="1" overflowY="auto">
          <Tabs variant="enclosed" colorScheme="purple">
            <TabList px={4}>
              <Tab fontSize="sm">Explain</Tab>
              <Tab fontSize="sm">Refactor</Tab>
              <Tab fontSize="sm">Suggest</Tab>
              <Tab fontSize="sm">Custom</Tab>
            </TabList>

            <TabPanels>
              {/* Explain Tab */}
              <TabPanel p={4}>
                <VStack spacing={4} align="stretch">
                  <Button
                    leftIcon={<BookOpen size={16} />}
                    colorScheme="purple"
                    onClick={handleExplainCode}
                    isLoading={isLoading}
                    loadingText="Analyzing..."
                  >
                    Explain This Code
                  </Button>
                  
                  {explanation && (
                    <Box
                      p={4}
                      bg={useColorModeValue('gray.50', 'gray.700')}
                      rounded="md"
                      border="1px"
                      borderColor={borderColor}
                    >
                      <HStack justify="space-between" mb={2}>
                        <Text fontSize="sm" fontWeight="semibold">
                          Explanation
                        </Text>
                        <IconButton
                          aria-label="Copy explanation"
                          icon={<Copy size={14} />}
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(explanation)}
                        />
                      </HStack>
                      <Text fontSize="sm" color={textColor} whiteSpace="pre-wrap">
                        {explanation}
                      </Text>
                    </Box>
                  )}
                </VStack>
              </TabPanel>

              {/* Refactor Tab */}
              <TabPanel p={4}>
                <VStack spacing={4} align="stretch">
                  <Button
                    leftIcon={<Wrench size={16} />}
                    colorScheme="green"
                    onClick={handleRefactorCode}
                    isLoading={isLoading}
                    loadingText="Refactoring..."
                  >
                    Refactor Code
                  </Button>
                  
                  {refactoredCode && (
                    <Box
                      p={4}
                      bg={useColorModeValue('gray.50', 'gray.700')}
                      rounded="md"
                      border="1px"
                      borderColor={borderColor}
                    >
                      <HStack justify="space-between" mb={2}>
                        <Text fontSize="sm" fontWeight="semibold">
                          Refactored Code
                        </Text>
                        <IconButton
                          aria-label="Copy refactored code"
                          icon={<Copy size={14} />}
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(refactoredCode)}
                        />
                      </HStack>
                      <Code
                        as="pre"
                        fontSize="xs"
                        p={2}
                        bg={useColorModeValue('gray.100', 'gray.800')}
                        rounded="md"
                        overflowX="auto"
                        whiteSpace="pre-wrap"
                      >
                        {refactoredCode}
                      </Code>
                    </Box>
                  )}
                </VStack>
              </TabPanel>

              {/* Suggest Tab */}
              <TabPanel p={4}>
                <VStack spacing={4} align="stretch">
                  <Button
                    leftIcon={<Sparkles size={16} />}
                    colorScheme="blue"
                    onClick={handleGetSuggestions}
                    isLoading={isLoading}
                    loadingText="Generating..."
                  >
                    Get Suggestions
                  </Button>
                  
                  {suggestions.length > 0 && (
                    <VStack spacing={2} align="stretch">
                      <Text fontSize="sm" fontWeight="semibold">
                        AI Suggestions
                      </Text>
                      {suggestions.map((suggestion, index) => (
                        <Box
                          key={index}
                          p={3}
                          bg={useColorModeValue('gray.50', 'gray.700')}
                          rounded="md"
                          border="1px"
                          borderColor={borderColor}
                        >
                          <HStack justify="space-between">
                            <Text fontSize="sm" color={textColor}>
                              {suggestion}
                            </Text>
                            <HStack spacing={1}>
                              <IconButton
                                aria-label="Copy suggestion"
                                icon={<Copy size={12} />}
                                size="xs"
                                variant="ghost"
                                onClick={() => copyToClipboard(suggestion)}
                              />
                              <IconButton
                                aria-label="Use suggestion"
                                icon={<Zap size={12} />}
                                size="xs"
                                variant="ghost"
                                colorScheme="blue"
                              />
                            </HStack>
                          </HStack>
                        </Box>
                      ))}
                    </VStack>
                  )}
                </VStack>
              </TabPanel>

              {/* Custom Tab */}
              <TabPanel p={4}>
                <VStack spacing={4} align="stretch">
                  <Textarea
                    placeholder="Ask AI anything about your code..."
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    size="sm"
                    rows={3}
                  />
                  <Button
                    leftIcon={<Brain size={16} />}
                    colorScheme="purple"
                    onClick={handleCustomPrompt}
                    isLoading={isLoading}
                    loadingText="Processing..."
                    isDisabled={!userPrompt.trim()}
                  >
                    Ask AI
                  </Button>
                  
                  {explanation && (
                    <Box
                      p={4}
                      bg={useColorModeValue('gray.50', 'gray.700')}
                      rounded="md"
                      border="1px"
                      borderColor={borderColor}
                    >
                      <HStack justify="space-between" mb={2}>
                        <Text fontSize="sm" fontWeight="semibold">
                          AI Response
                        </Text>
                        <HStack spacing={1}>
                          <IconButton
                            aria-label="Copy response"
                            icon={<Copy size={14} />}
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(explanation)}
                          />
                          <IconButton
                            aria-label="Like response"
                            icon={<ThumbsUp size={14} />}
                            size="sm"
                            variant="ghost"
                            colorScheme="green"
                          />
                          <IconButton
                            aria-label="Dislike response"
                            icon={<ThumbsDown size={14} />}
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                          />
                        </HStack>
                      </HStack>
                      <Text fontSize="sm" color={textColor} whiteSpace="pre-wrap">
                        {explanation}
                      </Text>
                    </Box>
                  )}
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </VStack>
    </Box>
  )
}

export default AIPanel
