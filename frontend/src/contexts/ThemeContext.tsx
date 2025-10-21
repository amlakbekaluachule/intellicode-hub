import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useColorMode } from '@chakra-ui/react'

interface ThemeContextType {
  isDark: boolean
  toggleTheme: () => void
  setTheme: (theme: 'light' | 'dark') => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { colorMode, toggleColorMode, setColorMode } = useColorMode()
  const [isDark, setIsDark] = useState(colorMode === 'dark')

  useEffect(() => {
    setIsDark(colorMode === 'dark')
    // Update document class for Tailwind dark mode
    if (colorMode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [colorMode])

  const toggleTheme = () => {
    toggleColorMode()
  }

  const setTheme = (theme: 'light' | 'dark') => {
    setColorMode(theme)
  }

  const value: ThemeContextType = {
    isDark,
    toggleTheme,
    setTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
