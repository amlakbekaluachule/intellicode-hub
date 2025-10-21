import React, { useState } from 'react'
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  Divider,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  Link,
  Heading,
  Card,
  CardBody,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Github, Chrome, ArrowRight, Sparkles } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const { login, loginWithGoogle, loginWithGitHub } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.700', 'gray.200')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await login(formData.email, formData.password)
      navigate('/')
    } catch (error: any) {
      setError(error.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError('')

    try {
      await loginWithGoogle()
      navigate('/')
    } catch (error: any) {
      setError(error.message || 'Google login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGitHubLogin = async () => {
    setIsLoading(true)
    setError('')

    try {
      await loginWithGitHub()
      navigate('/')
    } catch (error: any) {
      setError(error.message || 'GitHub login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box minH="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center">
      <Container maxW="md" py={8}>
        <VStack spacing={8}>
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Box position="relative">
              <Box
                p={4}
                bg="blue.500"
                rounded="full"
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                className="animate-pulse"
              >
                <Sparkles size={32} color="white" />
              </Box>
            </Box>
            <VStack spacing={2}>
              <Heading as="h1" size="xl" color={textColor}>
                Welcome to IntelliCode Hub
              </Heading>
              <Text color="gray.500" maxW="md">
                Sign in to your account to continue building amazing projects with AI-powered assistance.
              </Text>
            </VStack>
          </VStack>

          {/* Login Form */}
          <Card variant="glass" bg={cardBg} w="full" maxW="md">
            <CardBody p={8}>
              <VStack spacing={6} align="stretch">
                {error && (
                  <Alert status="error" rounded="md">
                    <AlertIcon />
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <FormLabel fontSize="sm" color={textColor}>Email</FormLabel>
                      <InputGroup>
                        <InputLeftElement>
                          <Mail size={16} />
                        </InputLeftElement>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </InputGroup>
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize="sm" color={textColor}>Password</FormLabel>
                      <InputGroup>
                        <InputLeftElement>
                          <Lock size={16} />
                        </InputLeftElement>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          required
                        />
                      </InputGroup>
                    </FormControl>

                    <Button
                      type="submit"
                      colorScheme="blue"
                      size="lg"
                      isLoading={isLoading}
                      loadingText="Signing in..."
                      rightIcon={<ArrowRight size={20} />}
                    >
                      Sign In
                    </Button>
                  </VStack>
                </form>

                <HStack>
                  <Divider />
                  <Text fontSize="sm" color="gray.500">OR</Text>
                  <Divider />
                </HStack>

                {/* Social Login */}
                <VStack spacing={3} align="stretch">
                  <Button
                    variant="outline"
                    size="lg"
                    leftIcon={<Chrome size={20} />}
                    onClick={handleGoogleLogin}
                    isLoading={isLoading}
                    loadingText="Connecting..."
                  >
                    Continue with Google
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    leftIcon={<Github size={20} />}
                    onClick={handleGitHubLogin}
                    isLoading={isLoading}
                    loadingText="Connecting..."
                  >
                    Continue with GitHub
                  </Button>
                </VStack>

                <HStack justify="center" spacing={1}>
                  <Text fontSize="sm" color="gray.500">
                    Don't have an account?
                  </Text>
                  <Link
                    color="blue.500"
                    fontSize="sm"
                    fontWeight="medium"
                    onClick={() => navigate('/register')}
                  >
                    Sign up
                  </Link>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Features */}
          <VStack spacing={4} textAlign="center">
            <Text fontSize="sm" color="gray.500">
              Join thousands of developers building the future
            </Text>
            <HStack spacing={6} fontSize="sm" color="gray.500">
              <HStack spacing={1}>
                <Sparkles size={16} />
                <Text>AI-Powered</Text>
              </HStack>
              <HStack spacing={1}>
                <Github size={16} />
                <Text>Git Integration</Text>
              </HStack>
              <HStack spacing={1}>
                <Lock size={16} />
                <Text>Secure</Text>
              </HStack>
            </HStack>
          </VStack>
        </VStack>
      </Container>
    </Box>
  )
}

export default Login
