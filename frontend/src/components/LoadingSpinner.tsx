import React from 'react'
import { Box, Spinner, Text, VStack, useColorModeValue } from '@chakra-ui/react'
import { Code } from 'lucide-react'

const LoadingSpinner: React.FC = () => {
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const spinnerColor = useColorModeValue('blue.500', 'blue.400')

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={useColorModeValue('gray.50', 'gray.900')}
    >
      <VStack spacing={4}>
        <Box position="relative">
          <Code size={48} className="animate-pulse" />
          <Spinner
            size="xl"
            color={spinnerColor}
            thickness="4px"
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
          />
        </Box>
        <Text color={textColor} fontSize="lg" fontWeight="medium">
          Loading IntelliCode Hub...
        </Text>
      </VStack>
    </Box>
  )
}

export default LoadingSpinner
