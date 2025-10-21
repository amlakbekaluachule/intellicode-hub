import React from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  IconButton,
  useColorModeValue,
  Divider,
  Badge,
} from '@chakra-ui/react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Home,
  Code,
  FolderOpen,
  User,
  Settings,
  Plus,
  Search,
  Star,
  GitBranch,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface NavItemProps {
  icon: React.ReactNode
  label: string
  path: string
  isActive: boolean
  onClick: () => void
  badge?: string
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, path, isActive, onClick, badge }) => {
  const bgColor = useColorModeValue('blue.50', 'blue.900')
  const textColor = useColorModeValue('blue.700', 'blue.200')
  const hoverBg = useColorModeValue('gray.100', 'gray.700')

  return (
    <Box
      as="button"
      w="full"
      p={3}
      rounded="lg"
      bg={isActive ? bgColor : 'transparent'}
      color={isActive ? textColor : 'inherit'}
      _hover={{ bg: isActive ? bgColor : hoverBg }}
      onClick={onClick}
      transition="all 0.2s"
      position="relative"
    >
      <HStack spacing={3}>
        {icon}
        <Text fontSize="sm" fontWeight={isActive ? 'semibold' : 'medium'}>
          {label}
        </Text>
        {badge && (
          <Badge size="sm" colorScheme="blue" ml="auto">
            {badge}
          </Badge>
        )}
      </HStack>
    </Box>
  )
}

const Sidebar: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const navItems = [
    { icon: <Home size={20} />, label: 'Home', path: '/' },
    { icon: <Code size={20} />, label: 'Editor', path: '/editor' },
    { icon: <FolderOpen size={20} />, label: 'Projects', path: '/projects' },
    { icon: <User size={20} />, label: 'Profile', path: '/profile' },
  ]

  const quickActions = [
    { icon: <Plus size={20} />, label: 'New Project', path: '/projects/new' },
    { icon: <Search size={20} />, label: 'Search', path: '/search' },
    { icon: <Star size={20} />, label: 'Favorites', path: '/favorites' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <Box
      w="64"
      h="full"
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
      p={4}
      overflowY="auto"
    >
      <VStack spacing={6} align="stretch">
        {/* User Info */}
        <Box>
          <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={2}>
            WELCOME BACK
          </Text>
          <Text fontSize="sm" fontWeight="semibold" noOfLines={1}>
            {user?.name || 'Guest'}
          </Text>
          <Text fontSize="xs" color="gray.500">
            {user?.role || 'viewer'}
          </Text>
        </Box>

        <Divider />

        {/* Main Navigation */}
        <VStack spacing={2} align="stretch">
          <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={2}>
            NAVIGATION
          </Text>
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              isActive={isActive(item.path)}
              onClick={() => navigate(item.path)}
            />
          ))}
        </VStack>

        <Divider />

        {/* Quick Actions */}
        <VStack spacing={2} align="stretch">
          <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={2}>
            QUICK ACTIONS
          </Text>
          {quickActions.map((item) => (
            <NavItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              isActive={isActive(item.path)}
              onClick={() => navigate(item.path)}
            />
          ))}
        </VStack>

        <Divider />

        {/* Recent Projects */}
        <VStack spacing={2} align="stretch">
          <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={2}>
            RECENT PROJECTS
          </Text>
          <Box
            p={3}
            rounded="lg"
            bg={useColorModeValue('gray.50', 'gray.700')}
            border="1px"
            borderColor={useColorModeValue('gray.200', 'gray.600')}
          >
            <HStack spacing={2} mb={2}>
              <GitBranch size={16} />
              <Text fontSize="xs" fontWeight="semibold">
                My React App
              </Text>
            </HStack>
            <Text fontSize="xs" color="gray.500">
              Updated 2 hours ago
            </Text>
          </Box>
        </VStack>
      </VStack>
    </Box>
  )
}

export default Sidebar
