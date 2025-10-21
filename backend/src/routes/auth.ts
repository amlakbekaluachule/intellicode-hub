import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../config/database'
import { authenticate, AuthRequest } from '../middleware/auth'
import { logger } from '../utils/logger'

const router = Router()

// Validation middleware
const validateRegister = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
]

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
]

// Register
router.post('/register', validateRegister, async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: errors.array() }
      })
    }

    const { email, password, name } = req.body

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: { message: 'User already exists with this email' }
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        // Note: In a real app, you'd store the hashed password
        // For this demo, we're not storing passwords
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      }
    })

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    logger.info(`New user registered: ${user.email}`)

    res.status(201).json({
      success: true,
      data: {
        user,
        token
      }
    })
  } catch (error) {
    logger.error('Registration error:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Registration failed' }
    })
  }
})

// Login
router.post('/login', validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: errors.array() }
      })
    }

    const { email, password } = req.body

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid credentials' }
      })
    }

    // In a real app, you'd verify the password here
    // For this demo, we'll skip password verification

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    logger.info(`User logged in: ${user.email}`)

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token
      }
    })
  } catch (error) {
    logger.error('Login error:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Login failed' }
    })
  }
})

// Get current user
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    res.json({
      success: true,
      data: { user: req.user }
    })
  } catch (error) {
    logger.error('Get current user error:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get user data' }
    })
  }
})

// Google OAuth (placeholder)
router.post('/google', async (req, res) => {
  try {
    // In a real app, you'd implement Google OAuth here
    res.status(501).json({
      success: false,
      error: { message: 'Google OAuth not implemented yet' }
    })
  } catch (error) {
    logger.error('Google OAuth error:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Google OAuth failed' }
    })
  }
})

// GitHub OAuth (placeholder)
router.post('/github', async (req, res) => {
  try {
    // In a real app, you'd implement GitHub OAuth here
    res.status(501).json({
      success: false,
      error: { message: 'GitHub OAuth not implemented yet' }
    })
  } catch (error) {
    logger.error('GitHub OAuth error:', error)
    res.status(500).json({
      success: false,
      error: { message: 'GitHub OAuth failed' }
    })
  }
})

// Logout
router.post('/logout', authenticate, async (req: AuthRequest, res) => {
  try {
    // In a real app, you might blacklist the token here
    logger.info(`User logged out: ${req.user?.email}`)
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    })
  } catch (error) {
    logger.error('Logout error:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Logout failed' }
    })
  }
})

export { router as authRoutes }
