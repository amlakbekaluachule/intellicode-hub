import React from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Grid,
  Card,
  CardBody,
  Badge,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import {
  Code,
  Zap,
  Users,
  GitBranch,
  Sparkles,
  ArrowRight,
  Play,
  Star,
  Eye,
} from 'lucide-react'

const Home: React.FC = () => {
  const navigate = useNavigate()
  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50)',
    'linear(to-br, gray.900, blue.900)'
  )
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.700', 'gray.200')

  const features = [
    {
      icon: <Sparkles size={24} />,
      title: 'AI-Powered Code Intelligence',
      description: 'Get smart suggestions, explanations, and refactoring powered by GPT-4',
      color: 'blue',
    },
    {
      icon: <Users size={24} />,
      title: 'Real-time Collaboration',
      description: 'Code together with your team in real-time with live cursors and changes',
      color: 'green',
    },
    {
      icon: <GitBranch size={24} />,
      title: 'Version Control & Git',
      description: 'Built-in Git integration with visual diff and merge conflict resolution',
      color: 'purple',
    },
    {
      icon: <Zap size={24} />,
      title: 'Instant Deployment',
      description: 'Deploy your projects instantly with one-click preview environments',
      color: 'orange',
    },
  ]

  const stats = [
    { label: 'Active Projects', value: '1,234', icon: <Code size={20} /> },
    { label: 'Collaborators', value: '5,678', icon: <Users size={20} /> },
    { label: 'Code Lines', value: '2.3M', icon: <GitBranch size={20} /> },
    { label: 'AI Suggestions', value: '45K', icon: <Sparkles size={20} /> },
  ]

  return (
    <Box minH="100vh" bgGradient={bgGradient}>
      <Container maxW="7xl" py={20}>
        {/* Hero Section */}
        <VStack spacing={8} textAlign="center" mb={20}>
          <VStack spacing={4}>
            <Badge colorScheme="blue" variant="subtle" px={4} py={2} rounded="full">
              <HStack spacing={2}>
                <Sparkles size={16} />
                <Text>AI-Powered Development</Text>
              </HStack>
            </Badge>
            <Heading
              as="h1"
              size="4xl"
              bgGradient="linear(to-r, blue.400, purple.400)"
              bgClip="text"
              fontWeight="bold"
            >
              IntelliCode Hub
            </Heading>
            <Text fontSize="xl" color={textColor} maxW="2xl">
              The future of coding is here. Build, collaborate, and deploy with AI-powered
              intelligence that understands your code like never before.
            </Text>
          </VStack>

          <HStack spacing={4}>
            <Button
              size="lg"
              colorScheme="blue"
              rightIcon={<ArrowRight size={20} />}
              onClick={() => navigate('/editor')}
              _hover={{ transform: 'translateY(-2px)' }}
              transition="all 0.2s"
            >
              Start Coding
            </Button>
            <Button
              size="lg"
              variant="outline"
              leftIcon={<Play size={20} />}
              onClick={() => navigate('/projects')}
            >
              View Projects
            </Button>
          </HStack>
        </VStack>

        {/* Stats Section */}
        <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} gap={6} mb={20}>
          {stats.map((stat, index) => (
            <Card key={index} variant="glass" bg={cardBg}>
              <CardBody textAlign="center">
                <VStack spacing={3}>
                  <Icon color="blue.500">{stat.icon}</Icon>
                  <Text fontSize="2xl" fontWeight="bold">
                    {stat.value}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {stat.label}
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </Grid>

        {/* Features Section */}
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center">
            <Heading as="h2" size="2xl">
              Powerful Features
            </Heading>
            <Text fontSize="lg" color={textColor} maxW="2xl">
              Everything you need to build, collaborate, and deploy amazing applications
            </Text>
          </VStack>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={8}>
            {features.map((feature, index) => (
              <Card key={index} variant="glass" bg={cardBg} _hover={{ transform: 'translateY(-4px)' }} transition="all 0.3s">
                <CardBody>
                  <VStack spacing={4} align="start">
                    <HStack spacing={3}>
                      <Box
                        p={2}
                        rounded="lg"
                        bg={`${feature.color}.100`}
                        color={`${feature.color}.600`}
                      >
                        {feature.icon}
                      </Box>
                      <Heading as="h3" size="md">
                        {feature.title}
                      </Heading>
                    </HStack>
                    <Text color={textColor}>
                      {feature.description}
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </Grid>
        </VStack>

        {/* CTA Section */}
        <Box
          mt={20}
          p={8}
          rounded="2xl"
          bg={cardBg}
          textAlign="center"
          border="1px"
          borderColor={useColorModeValue('gray.200', 'gray.700')}
        >
          <VStack spacing={6}>
            <Heading as="h2" size="xl">
              Ready to revolutionize your coding experience?
            </Heading>
            <Text fontSize="lg" color={textColor} maxW="2xl">
              Join thousands of developers who are already building the future with AI-powered tools.
            </Text>
            <HStack spacing={4}>
              <Button
                size="lg"
                colorScheme="blue"
                rightIcon={<ArrowRight size={20} />}
                onClick={() => navigate('/editor')}
              >
                Get Started Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                leftIcon={<Eye size={20} />}
                onClick={() => navigate('/projects')}
              >
                View Examples
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Container>
    </Box>
  )
}

export default Home
