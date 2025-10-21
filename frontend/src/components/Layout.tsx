import React from 'react'
import { Box, Flex, useColorModeValue } from '@chakra-ui/react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import Sidebar from './Sidebar'
import Header from './Header'
import LoadingSpinner from './LoadingSpinner'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isLoading } = useAuth()
  const { isDark } = useTheme()
  const bgColor = useColorModeValue('gray.50', 'gray.900')

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <Box minH="100vh" bg={bgColor} className={isDark ? 'dark' : ''}>
      <Flex h="100vh" overflow="hidden">
        <Sidebar />
        <Flex direction="column" flex="1" overflow="hidden">
          <Header />
          <Box flex="1" overflow="auto" p={4}>
            {children}
          </Box>
        </Flex>
      </Flex>
    </Box>
  )
}

export default Layout
