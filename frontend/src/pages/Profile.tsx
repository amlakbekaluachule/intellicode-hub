import React, { useState } from 'react'
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Button,
  Avatar,
  Badge,
  useColorModeValue,
  Divider,
  Grid,
  Card,
  CardBody,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  Switch,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  IconButton,
} from '@chakra-ui/react'
import {
  Edit,
  Save,
  X,
  User,
  Mail,
  Calendar,
  Settings,
  Bell,
  Shield,
  Palette,
  Code,
  Star,
  GitBranch,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

const Profile: React.FC = () => {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: '',
    website: '',
    location: '',
  })
  
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.700', 'gray.200')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const handleSave = () => {
    // Save profile changes
    console.log('Saving profile:', formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      bio: '',
      website: '',
      location: '',
    })
    setIsEditing(false)
  }

  const stats = [
    { label: 'Projects', value: '12', icon: <Code size={20} /> },
    { label: 'Stars', value: '45', icon: <Star size={20} /> },
    { label: 'Commits', value: '234', icon: <GitBranch size={20} /> },
  ]

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="4xl" py={8}>
        {/* Header */}
        <VStack spacing={6} align="stretch" mb={8}>
          <HStack justify="space-between">
            <HStack spacing={6}>
              <Avatar
                size="2xl"
                src={user?.avatar}
                name={user?.name}
                bg="blue.500"
              />
              <VStack align="start" spacing={2}>
                <HStack spacing={3}>
                  <Heading as="h1" size="xl" color={textColor}>
                    {user?.name}
                  </Heading>
                  <Badge colorScheme="blue" variant="subtle">
                    {user?.role}
                  </Badge>
                </HStack>
                <Text color="gray.500">{user?.email}</Text>
                <Text fontSize="sm" color="gray.500">
                  Member since {new Date(user?.createdAt || '').toLocaleDateString()}
                </Text>
              </VStack>
            </HStack>
            
            <HStack spacing={2}>
              {isEditing ? (
                <>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    leftIcon={<Save size={16} />}
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<X size={16} />}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  leftIcon={<Edit size={16} />}
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              )}
            </HStack>
          </HStack>

          {/* Stats */}
          <Grid templateColumns={{ base: 'repeat(3, 1fr)' }} gap={4}>
            {stats.map((stat, index) => (
              <Card key={index} variant="glass" bg={cardBg}>
                <CardBody textAlign="center">
                  <VStack spacing={2}>
                    <Box color="blue.500">{stat.icon}</Box>
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
        </VStack>

        {/* Content Tabs */}
        <Tabs variant="enclosed" colorScheme="blue">
          <TabList>
            <Tab>Profile</Tab>
            <Tab>Settings</Tab>
            <Tab>Activity</Tab>
          </TabList>

          <TabPanels>
            {/* Profile Tab */}
            <TabPanel p={0} pt={6}>
              <VStack spacing={6} align="stretch">
                <Card variant="glass" bg={cardBg}>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <HStack spacing={3}>
                        <User size={20} />
                        <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                          Personal Information
                        </Text>
                      </HStack>
                      
                      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                        <FormControl>
                          <FormLabel fontSize="sm" color={textColor}>Name</FormLabel>
                          <Input
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            isDisabled={!isEditing}
                          />
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel fontSize="sm" color={textColor}>Email</FormLabel>
                          <Input
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            isDisabled={!isEditing}
                          />
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel fontSize="sm" color={textColor}>Location</FormLabel>
                          <Input
                            value={formData.location}
                            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                            isDisabled={!isEditing}
                            placeholder="City, Country"
                          />
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel fontSize="sm" color={textColor}>Website</FormLabel>
                          <Input
                            value={formData.website}
                            onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                            isDisabled={!isEditing}
                            placeholder="https://your-website.com"
                          />
                        </FormControl>
                      </Grid>
                      
                      <FormControl>
                        <FormLabel fontSize="sm" color={textColor}>Bio</FormLabel>
                        <Textarea
                          value={formData.bio}
                          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                          isDisabled={!isEditing}
                          placeholder="Tell us about yourself..."
                          rows={3}
                        />
                      </FormControl>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>

            {/* Settings Tab */}
            <TabPanel p={0} pt={6}>
              <VStack spacing={6} align="stretch">
                <Card variant="glass" bg={cardBg}>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <HStack spacing={3}>
                        <Palette size={20} />
                        <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                          Appearance
                        </Text>
                      </HStack>
                      
                      <HStack justify="space-between">
                        <VStack align="start" spacing={1}>
                          <Text fontSize="sm" fontWeight="medium" color={textColor}>
                            Dark Mode
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            Toggle between light and dark themes
                          </Text>
                        </VStack>
                        <Switch
                          isChecked={isDark}
                          onChange={toggleTheme}
                          colorScheme="blue"
                        />
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>

                <Card variant="glass" bg={cardBg}>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <HStack spacing={3}>
                        <Bell size={20} />
                        <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                          Notifications
                        </Text>
                      </HStack>
                      
                      <VStack spacing={3} align="stretch">
                        <HStack justify="space-between">
                          <Text fontSize="sm" color={textColor}>Email Notifications</Text>
                          <Switch colorScheme="blue" defaultChecked />
                        </HStack>
                        <HStack justify="space-between">
                          <Text fontSize="sm" color={textColor}>Push Notifications</Text>
                          <Switch colorScheme="blue" defaultChecked />
                        </HStack>
                        <HStack justify="space-between">
                          <Text fontSize="sm" color={textColor}>Collaboration Updates</Text>
                          <Switch colorScheme="blue" defaultChecked />
                        </HStack>
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>

                <Card variant="glass" bg={cardBg}>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <HStack spacing={3}>
                        <Shield size={20} />
                        <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                          Security
                        </Text>
                      </HStack>
                      
                      <VStack spacing={3} align="stretch">
                        <Button variant="outline" size="sm" alignSelf="start">
                          Change Password
                        </Button>
                        <Button variant="outline" size="sm" alignSelf="start">
                          Two-Factor Authentication
                        </Button>
                        <Button
                          colorScheme="red"
                          variant="outline"
                          size="sm"
                          alignSelf="start"
                          onClick={logout}
                        >
                          Sign Out
                        </Button>
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>
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
          </TabPanels>
        </Tabs>
      </Container>
    </Box>
  )
}

export default Profile
