import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  useColorModeValue,
  Divider,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Grid,
  Card,
  CardBody,
  Avatar,
  Flex,
  Spinner,
} from '@chakra-ui/react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Edit,
  Share,
  Star,
  GitBranch,
  Calendar,
  User,
  Globe,
  Lock,
  Code,
  FileText,
  Settings,
  Play,
  Download,
} from 'lucide-react'
import { projectApi } from '../services/api'
import { Project } from '../types/project'

const ProjectDetail: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.700', 'gray.200')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  useEffect(() => {
    if (id) {
      loadProject()
    }
  }, [id])

  const loadProject = async () => {
    if (!id) return
    
    setIsLoading(true)
    try {
      const projectData = await projectApi.getProject(id)
      setProject(projectData)
    } catch (error) {
      console.error('Failed to load project:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return <Code size={16} />
      case 'md':
        return <FileText size={16} />
      default:
        return <FileText size={16} />
    }
  }

  if (isLoading) {
    return (
      <Box minH="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="blue.500" />
      </Box>
    )
  }

  if (!project) {
    return (
      <Box minH="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Text fontSize="xl" color={textColor}>Project not found</Text>
          <Button onClick={() => navigate('/projects')}>Back to Projects</Button>
        </VStack>
      </Box>
    )
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="7xl" py={8}>
        {/* Header */}
        <VStack spacing={6} align="stretch" mb={8}>
          <HStack justify="space-between">
            <HStack spacing={4}>
              <IconButton
                aria-label="Back to projects"
                icon={<ArrowLeft size={20} />}
                variant="ghost"
                onClick={() => navigate('/projects')}
              />
              <VStack align="start" spacing={2}>
                <HStack spacing={3}>
                  <Heading as="h1" size="2xl" color={textColor}>
                    {project.name}
                  </Heading>
                  {project.isPublic ? (
                    <Badge colorScheme="green" variant="subtle">
                      <HStack spacing={1}>
                        <Globe size={12} />
                        <Text>Public</Text>
                      </HStack>
                    </Badge>
                  ) : (
                    <Badge colorScheme="gray" variant="subtle">
                      <HStack spacing={1}>
                        <Lock size={12} />
                        <Text>Private</Text>
                      </HStack>
                    </Badge>
                  )}
                </HStack>
                {project.description && (
                  <Text color="gray.500" maxW="2xl">
                    {project.description}
                  </Text>
                )}
              </VStack>
            </HStack>
            
            <HStack spacing={2}>
              <Button
                leftIcon={<Edit size={16} />}
                onClick={() => navigate(`/editor/${project.id}`)}
              >
                Edit Code
              </Button>
              <Button
                variant="outline"
                leftIcon={<Share size={16} />}
              >
                Share
              </Button>
              <IconButton
                aria-label="Settings"
                icon={<Settings size={16} />}
                variant="ghost"
              />
            </HStack>
          </HStack>

          {/* Project Stats */}
          <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} gap={4}>
            <Card variant="glass" bg={cardBg}>
              <CardBody textAlign="center">
                <VStack spacing={2}>
                  <Code size={24} color="blue.500" />
                  <Text fontSize="2xl" fontWeight="bold">
                    {project.files.length}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Files
                  </Text>
                </VStack>
              </CardBody>
            </Card>
            
            <Card variant="glass" bg={cardBg}>
              <CardBody textAlign="center">
                <VStack spacing={2}>
                  <User size={24} color="green.500" />
                  <Text fontSize="2xl" fontWeight="bold">
                    {project.collaborators.length}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Collaborators
                  </Text>
                </VStack>
              </CardBody>
            </Card>
            
            <Card variant="glass" bg={cardBg}>
              <CardBody textAlign="center">
                <VStack spacing={2}>
                  <GitBranch size={24} color="purple.500" />
                  <Text fontSize="2xl" fontWeight="bold">
                    12
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Commits
                  </Text>
                </VStack>
              </CardBody>
            </Card>
            
            <Card variant="glass" bg={cardBg}>
              <CardBody textAlign="center">
                <VStack spacing={2}>
                  <Star size={24} color="yellow.500" />
                  <Text fontSize="2xl" fontWeight="bold">
                    0
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Stars
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </Grid>
        </VStack>

        {/* Content Tabs */}
        <Tabs variant="enclosed" colorScheme="blue">
          <TabList>
            <Tab>Files</Tab>
            <Tab>Collaborators</Tab>
            <Tab>Activity</Tab>
            <Tab>Settings</Tab>
          </TabList>

          <TabPanels>
            {/* Files Tab */}
            <TabPanel p={0} pt={6}>
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                    Project Files
                  </Text>
                  <Button size="sm" leftIcon={<Play size={16} />}>
                    Run Project
                  </Button>
                </HStack>
                
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={4}>
                  {project.files.map((file) => (
                    <Card key={file.id} variant="glass" bg={cardBg} _hover={{ transform: 'translateY(-2px)' }} transition="all 0.2s">
                      <CardBody>
                        <VStack spacing={3} align="stretch">
                          <HStack spacing={3}>
                            {getFileIcon(file.name)}
                            <VStack align="start" spacing={0} flex="1">
                              <Text fontSize="sm" fontWeight="semibold" color={textColor} noOfLines={1}>
                                {file.name}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                {file.size} bytes
                              </Text>
                            </VStack>
                          </HStack>
                          
                          <HStack spacing={2} fontSize="xs" color="gray.500">
                            <Calendar size={12} />
                            <Text>Updated {formatDate(file.updatedAt)}</Text>
                          </HStack>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            leftIcon={<Edit size={14} />}
                            onClick={() => navigate(`/editor/${project.id}?file=${file.path}`)}
                          >
                            Edit
                          </Button>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </Grid>
              </VStack>
            </TabPanel>

            {/* Collaborators Tab */}
            <TabPanel p={0} pt={6}>
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                    Collaborators
                  </Text>
                  <Button size="sm" leftIcon={<User size={16} />}>
                    Invite
                  </Button>
                </HStack>
                
                <VStack spacing={3} align="stretch">
                  {project.collaborators.map((collaborator) => (
                    <Card key={collaborator.id} variant="glass" bg={cardBg}>
                      <CardBody>
                        <HStack spacing={4}>
                          <Avatar
                            size="md"
                            src={collaborator.user.avatar}
                            name={collaborator.user.name}
                            bg="blue.500"
                          />
                          <VStack align="start" spacing={1} flex="1">
                            <Text fontWeight="semibold" color={textColor}>
                              {collaborator.user.name}
                            </Text>
                            <Badge colorScheme="blue" variant="subtle" size="sm">
                              {collaborator.role}
                            </Badge>
                          </VStack>
                          <Text fontSize="sm" color="gray.500">
                            Joined {formatDate(collaborator.joinedAt)}
                          </Text>
                        </HStack>
                      </CardBody>
                    </Card>
                  ))}
                </VStack>
              </VStack>
            </TabPanel>

            {/* Activity Tab */}
            <TabPanel p={0} pt={6}>
              <VStack spacing={4} align="stretch">
                <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                  Recent Activity
                </Text>
                <Text color="gray.500">Activity feed coming soon...</Text>
              </VStack>
            </TabPanel>

            {/* Settings Tab */}
            <TabPanel p={0} pt={6}>
              <VStack spacing={4} align="stretch">
                <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                  Project Settings
                </Text>
                <Text color="gray.500">Settings panel coming soon...</Text>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Box>
  )
}

export default ProjectDetail
