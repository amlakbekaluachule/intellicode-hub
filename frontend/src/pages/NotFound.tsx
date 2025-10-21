import React from 'react'
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Home, Search } from 'lucide-react'

const NotFound: React.FC = () => {
  const navigate = useNavigate()
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const textColor = useColorModeValue('gray.700', 'gray.200')

  return (
    <Box minH="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center">
      <Container maxW="md" textAlign="center">
        <VStack spacing={8}>
          <VStack spacing={4}>
            <Heading as="h1" size="4xl" color="blue.500">
              404
            </Heading>
            <Heading as="h2" size="xl" color={textColor}>
              Page Not Found
            </Heading>
            <Text color="gray.500" maxW="md">
              The page you're looking for doesn't exist or has been moved.
            </Text>
          </VStack>

          <HStack spacing={4}>
            <Button
              leftIcon={<ArrowLeft size={20} />}
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
            <Button
              colorScheme="blue"
              leftIcon={<Home size={20} />}
              onClick={() => navigate('/')}
            >
              Go Home
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  )
}

export default NotFound
