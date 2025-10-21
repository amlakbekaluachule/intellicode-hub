import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import { prisma } from '../config/database'
import { authenticate, AuthRequest } from '../middleware/auth'
import { logger } from '../utils/logger'

const router = Router()

// Get user profile
router.get('/profile', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            projects: true,
            collaborations: true
          }
        }
      }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      })
    }

    res.json({
      success: true,
      data: { user }
    })
  } catch (error) {
    logger.error('Get user profile error:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch user profile' }
    })
  }
})

// Update user profile
router.put('/profile', authenticate, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('avatar').optional().isURL().withMessage('Avatar must be a valid URL')
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: errors.array() }
      })
    }

    const { name, avatar } = req.body

    const updatedUser = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        ...(name && { name }),
        ...(avatar && { avatar }),
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })

    logger.info(`User profile updated: ${req.user!.email}`)

    res.json({
      success: true,
      data: { user: updatedUser }
    })
  } catch (error) {
    logger.error('Update user profile error:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update user profile' }
    })
  }
})

// Get user statistics
router.get('/stats', authenticate, async (req: AuthRequest, res) => {
  try {
    const stats = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        _count: {
          select: {
            projects: true,
            collaborations: true,
            chatMessages: true
          }
        }
      }
    })

    // Get additional stats
    const projectStats = await prisma.project.aggregate({
      where: { ownerId: req.user!.id },
      _sum: {
        // Add any numeric fields you want to aggregate
      }
    })

    const fileStats = await prisma.projectFile.aggregate({
      where: {
        project: {
          ownerId: req.user!.id
        }
      },
      _count: {
        id: true
      },
      _sum: {
        size: true
      }
    })

    res.json({
      success: true,
      data: {
        projects: stats?._count.projects || 0,
        collaborations: stats?._count.collaborations || 0,
        messages: stats?._count.chatMessages || 0,
        files: fileStats._count.id || 0,
        totalFileSize: fileStats._sum.size || 0
      }
    })
  } catch (error) {
    logger.error('Get user stats error:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch user statistics' }
    })
  }
})

// Get user activity
router.get('/activity', authenticate, async (req: AuthRequest, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query

    // Get recent projects
    const recentProjects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: req.user!.id },
          { collaborations: { some: { userId: req.user!.id } } }
        ]
      },
      include: {
        owner: {
          select: { id: true, name: true, avatar: true }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: Number(limit),
      skip: Number(offset)
    })

    // Get recent chat messages
    const recentMessages = await prisma.chatMessage.findMany({
      where: {
        project: {
          OR: [
            { ownerId: req.user!.id },
            { collaborations: { some: { userId: req.user!.id } } }
          ]
        }
      },
      include: {
        user: {
          select: { id: true, name: true, avatar: true }
        },
        project: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
      skip: Number(offset)
    })

    res.json({
      success: true,
      data: {
        recentProjects,
        recentMessages
      }
    })
  } catch (error) {
    logger.error('Get user activity error:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch user activity' }
    })
  }
})

export { router as userRoutes }
