import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Button,
  Grid,
  Card,
  CardBody,
  CardHeader,
  Text,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Flex,
  Spinner,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Star,
  GitBranch,
  Calendar,
  User,
  Globe,
  Lock,
} from 'lucide-react'
import { projectApi } from '../services/api'
import { Project } from '../types/project'

const Projects: React.FC = () => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBy, setFilterBy] = useState('all')
  const [sortBy, setSortBy] = useState('updatedAt')
  
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.700', 'gray.200')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    setIsLoading(true)
    try {
      const projectList = await projectApi.getProjects()
      setProjects(projectList)
    } catch (error) {
      console.error('Failed to load projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'public' && project.isPublic) ||
                         (filterBy === 'private' && !project.isPublic)
    return matchesSearch && matchesFilter
  })

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'updatedAt':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      default:
        return 0
    }
  })

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectApi.deleteProject(projectId)
        setProjects(prev => prev.filter(p => p.id !== projectId))
      } catch (error) {
        console.error('Failed to delete project:', error)
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="7xl" py={8}>
        {/* Header */}
        <Flex justify="space-between" align="center" mb={8}>
          <VStack align="start" spacing={2}>
            <Heading as="h1" size="2xl" color={textColor}>
              My Projects
            </Heading>
            <Text color="gray.500">
              {projects.length} project{projects.length !== 1 ? 's' : ''}
            </Text>
          </VStack>
          <Button
            colorScheme="blue"
            leftIcon={<Plus size={20} />}
            onClick={() => navigate('/projects/new')}
          >
            New Project
          </Button>
        </Flex>

        {/* Filters */}
        <HStack spacing={4} mb={6}>
          <InputGroup maxW="300px">
            <InputLeftElement>
              <Search size={16} />
            </InputLeftElement>
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          
          <Select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            maxW="150px"
          >
            <option value="all">All Projects</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </Select>
          
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            maxW="150px"
          >
            <option value="updatedAt">Last Updated</option>
            <option value="createdAt">Date Created</option>
            <option value="name">Name</option>
          </Select>
        </HStack>

        {/* Projects Grid */}
        {isLoading ? (
          <Flex justify="center" py={20}>
            <Spinner size="xl" color="blue.500" />
          </Flex>
        ) : (
          <Grid
            templateColumns={{
              base: '1fr',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            }}
            gap={6}
          >
            {sortedProjects.map((project) => (
              <Card key={project.id} variant="glass" bg={cardBg} _hover={{ transform: 'translateY(-2px)' }} transition="all 0.2s">
                <CardHeader>
                  <Flex justify="space-between" align="start">
                    <VStack align="start" spacing={2} flex="1">
                      <HStack spacing={2}>
                        <Heading as="h3" size="md" color={textColor}>
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
                        <Text fontSize="sm" color="gray.500" noOfLines={2}>
                          {project.description}
                        </Text>
                      )}
                    </VStack>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<MoreVertical size={16} />}
                        variant="ghost"
                        size="sm"
                      />
                      <MenuList>
                        <MenuItem icon={<Eye size={16} />} onClick={() => navigate(`/projects/${project.id}`)}>
                          View
                        </MenuItem>
                        <MenuItem icon={<Edit size={16} />} onClick={() => navigate(`/editor/${project.id}`)}>
                          Edit
                        </MenuItem>
                        <MenuItem icon={<Trash2 size={16} />} onClick={() => handleDeleteProject(project.id)} color="red.500">
                          Delete
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Flex>
                </CardHeader>
                
                <CardBody pt={0}>
                  <VStack spacing={4} align="stretch">
                    {/* Project Stats */}
                    <HStack spacing={4} fontSize="sm" color="gray.500">
                      <HStack spacing={1}>
                        <GitBranch size={14} />
                        <Text>{project.files.length} files</Text>
                      </HStack>
                      <HStack spacing={1}>
                        <User size={14} />
                        <Text>{project.collaborators.length} collaborators</Text>
                      </HStack>
                    </HStack>

                    {/* Owner Info */}
                    <HStack spacing={2}>
                      <Text fontSize="sm" color="gray.500">Owner:</Text>
                      <HStack spacing={2}>
                        <Text fontSize="sm" fontWeight="medium" color={textColor}>
                          {project.owner.name}
                        </Text>
                      </HStack>
                    </HStack>

                    {/* Last Updated */}
                    <HStack spacing={2} fontSize="sm" color="gray.500">
                      <Calendar size={14} />
                      <Text>Updated {formatDate(project.updatedAt)}</Text>
                    </HStack>

                    {/* Actions */}
                    <HStack spacing={2}>
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<Eye size={16} />}
                        onClick={() => navigate(`/projects/${project.id}`)}
                        flex="1"
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        leftIcon={<Edit size={16} />}
                        onClick={() => navigate(`/editor/${project.id}`)}
                        flex="1"
                      >
                        Edit
                      </Button>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </Grid>
        )}

        {/* Empty State */}
        {!isLoading && sortedProjects.length === 0 && (
          <Box textAlign="center" py={20}>
            <VStack spacing={4}>
              <Box p={4} bg="gray.100" rounded="full">
                <GitBranch size={48} color="gray.400" />
              </Box>
              <VStack spacing={2}>
                <Heading as="h3" size="lg" color={textColor}>
                  No projects found
                </Heading>
                <Text color="gray.500" maxW="md">
                  {searchTerm || filterBy !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by creating your first project.'}
                </Text>
              </VStack>
              <Button
                colorScheme="blue"
                leftIcon={<Plus size={20} />}
                onClick={() => navigate('/projects/new')}
              >
                Create Project
              </Button>
            </VStack>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default Projects
