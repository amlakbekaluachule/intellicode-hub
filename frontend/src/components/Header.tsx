import React from 'react'
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Text,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Badge,
  Tooltip,
} from '@chakra-ui/react'
import { Bell, Settings, LogOut, User, Moon, Sun } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

const Header: React.FC = () => {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const textColor = useColorModeValue('gray.700', 'gray.200')

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <Box
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      px={6}
      py={4}
      shadow="sm"
    >
      <Flex justify="space-between" align="center">
        <HStack spacing={4}>
          <Text fontSize="xl" fontWeight="bold" color={textColor}>
            IntelliCode Hub
          </Text>
          <Badge colorScheme="blue" variant="subtle">
            AI-Powered
          </Badge>
        </HStack>

        <HStack spacing={4}>
          <Tooltip label="Toggle theme">
            <IconButton
              aria-label="Toggle theme"
              icon={isDark ? <Sun size={20} /> : <Moon size={20} />}
              variant="ghost"
              onClick={toggleTheme}
            />
          </Tooltip>

          <Tooltip label="Notifications">
            <IconButton
              aria-label="Notifications"
              icon={<Bell size={20} />}
              variant="ghost"
            />
          </Tooltip>

          <Menu>
            <MenuButton as={IconButton} variant="ghost" p={0}>
              <Avatar
                size="sm"
                src={user?.avatar}
                name={user?.name}
                bg="blue.500"
              />
            </MenuButton>
            <MenuList>
              <MenuItem icon={<User size={16} />}>
                Profile
              </MenuItem>
              <MenuItem icon={<Settings size={16} />}>
                Settings
              </MenuItem>
              <MenuItem icon={<LogOut size={16} />} onClick={handleLogout}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  )
}

export default Header
