import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import OpenAI from 'openai'
import { prisma } from '../config/database'
import { authenticate, AuthRequest } from '../middleware/auth'
import { redis } from '../config/redis'
import { logger } from '../utils/logger'

const router = Router()

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// AI Code Explanation
router.post('/explain', authenticate, [
  body('code').isString().withMessage('Code is required'),
  body('language').isString().withMessage('Language is required')
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: errors.array() }
      })
    }

    const { code, language } = req.body

    // Check cache first
    const cacheKey = `ai:explain:${Buffer.from(code).toString('base64')}:${language}`
    const cached = await redis.get(cacheKey)
    
    if (cached) {
      return res.json({
        success: true,
        data: { explanation: cached }
      })
    }

    const prompt = `Explain the following ${language} code in a clear and concise way. Focus on what the code does, its main components, and any important patterns or techniques used:

\`\`\`${language}
${code}
\`\`\`

Provide a detailed explanation that would help a developer understand the code's purpose and functionality.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert software developer and code reviewer. Provide clear, detailed explanations of code that help developers understand functionality, patterns, and best practices.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.3
    })

    const explanation = completion.choices[0]?.message?.content || 'Unable to generate explanation.'

    // Cache the result for 1 hour
    await redis.setex(cacheKey, 3600, explanation)

    // Store in database for analytics
    await prisma.aICache.create({
      data: {
        prompt: `explain:${language}:${code.substring(0, 100)}`,
        response: explanation,
        model: 'gpt-4',
        tokens: completion.usage?.total_tokens || 0,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    })

    res.json({
      success: true,
      data: { explanation }
    })
  } catch (error) {
    logger.error('AI explain error:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to generate explanation' }
    })
  }
})

// AI Code Refactoring
router.post('/refactor', authenticate, [
  body('code').isString().withMessage('Code is required'),
  body('language').isString().withMessage('Language is required'),
  body('context').optional().isString()
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: errors.array() }
      })
    }

    const { code, language, context } = req.body

    // Check cache first
    const cacheKey = `ai:refactor:${Buffer.from(code).toString('base64')}:${language}:${context || ''}`
    const cached = await redis.get(cacheKey)
    
    if (cached) {
      return res.json({
        success: true,
        data: { refactoredCode: cached }
      })
    }

    const prompt = `Refactor the following ${language} code to improve its quality, readability, and maintainability. ${context ? `Context: ${context}` : ''}

\`\`\`${language}
${code}
\`\`\`

Provide the refactored code with:
1. Better variable and function names
2. Improved code structure and organization
3. Better error handling
4. Performance optimizations where applicable
5. Following best practices for ${language}

Return only the refactored code without additional explanations.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert software developer specializing in code refactoring. Provide clean, well-structured, and maintainable code that follows best practices.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.2
    })

    const refactoredCode = completion.choices[0]?.message?.content || code

    // Cache the result for 1 hour
    await redis.setex(cacheKey, 3600, refactoredCode)

    // Store in database for analytics
    await prisma.aICache.create({
      data: {
        prompt: `refactor:${language}:${code.substring(0, 100)}`,
        response: refactoredCode,
        model: 'gpt-4',
        tokens: completion.usage?.total_tokens || 0,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    })

    res.json({
      success: true,
      data: { refactoredCode }
    })
  } catch (error) {
    logger.error('AI refactor error:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to refactor code' }
    })
  }
})

// AI Code Completion
router.post('/complete', authenticate, [
  body('code').isString().withMessage('Code is required'),
  body('language').isString().withMessage('Language is required'),
  body('position').isObject().withMessage('Position is required')
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: errors.array() }
      })
    }

    const { code, language, position } = req.body

    // Check cache first
    const cacheKey = `ai:complete:${Buffer.from(code).toString('base64')}:${language}:${JSON.stringify(position)}`
    const cached = await redis.get(cacheKey)
    
    if (cached) {
      return res.json({
        success: true,
        data: { completions: JSON.parse(cached) }
      })
    }

    const prompt = `Complete the following ${language} code. Provide 3-5 intelligent code completions that would logically follow from the current code:

\`\`\`${language}
${code}
\`\`\`

Return the completions as a JSON array of strings, each containing a reasonable continuation of the code.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert software developer. Provide intelligent code completions that are contextually appropriate and follow best practices.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.3
    })

    const response = completion.choices[0]?.message?.content || '[]'
    let completions: string[] = []
    
    try {
      completions = JSON.parse(response)
    } catch {
      // Fallback if JSON parsing fails
      completions = [response]
    }

    // Cache the result for 30 minutes
    await redis.setex(cacheKey, 1800, JSON.stringify(completions))

    res.json({
      success: true,
      data: { completions }
    })
  } catch (error) {
    logger.error('AI complete error:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to generate completions' }
    })
  }
})

// AI Code Suggestions
router.post('/suggest', authenticate, [
  body('type').isIn(['explain', 'refactor', 'debug', 'optimize', 'generate']).withMessage('Invalid suggestion type'),
  body('code').isString().withMessage('Code is required'),
  body('language').isString().withMessage('Language is required'),
  body('context').optional().isString(),
  body('options').optional().isObject()
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: errors.array() }
      })
    }

    const { type, code, language, context, options } = req.body

    // Check cache first
    const cacheKey = `ai:suggest:${type}:${Buffer.from(code).toString('base64')}:${language}:${context || ''}`
    const cached = await redis.get(cacheKey)
    
    if (cached) {
      return res.json({
        success: true,
        data: JSON.parse(cached)
      })
    }

    let prompt = ''
    let systemPrompt = ''

    switch (type) {
      case 'explain':
        systemPrompt = 'You are an expert software developer and code reviewer. Provide clear, detailed explanations of code.'
        prompt = `Explain the following ${language} code: ${context ? `Context: ${context}` : ''}\n\n\`\`\`${language}\n${code}\n\`\`\``
        break
      case 'refactor':
        systemPrompt = 'You are an expert software developer specializing in code refactoring. Provide clean, well-structured code.'
        prompt = `Refactor the following ${language} code: ${context ? `Context: ${context}` : ''}\n\n\`\`\`${language}\n${code}\n\`\`\``
        break
      case 'debug':
        systemPrompt = 'You are an expert debugging specialist. Help identify and fix issues in code.'
        prompt = `Debug the following ${language} code and suggest fixes: ${context ? `Context: ${context}` : ''}\n\n\`\`\`${language}\n${code}\n\`\`\``
        break
      case 'optimize':
        systemPrompt = 'You are an expert in code optimization. Provide performance improvements and best practices.'
        prompt = `Optimize the following ${language} code for better performance: ${context ? `Context: ${context}` : ''}\n\n\`\`\`${language}\n${code}\n\`\`\``
        break
      case 'generate':
        systemPrompt = 'You are an expert software developer. Generate high-quality code based on requirements.'
        prompt = `Generate ${language} code for: ${context || 'the given requirements'}\n\n\`\`\`${language}\n${code}\n\`\`\``
        break
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1500,
      temperature: 0.3
    })

    const content = completion.choices[0]?.message?.content || 'Unable to generate suggestion.'

    const response = {
      id: Date.now().toString(),
      type,
      content,
      suggestions: [],
      metadata: {
        model: 'gpt-4',
        tokens: completion.usage?.total_tokens || 0,
        timestamp: new Date().toISOString()
      }
    }

    // Cache the result for 1 hour
    await redis.setex(cacheKey, 3600, JSON.stringify(response))

    // Store in database for analytics
    await prisma.aICache.create({
      data: {
        prompt: `${type}:${language}:${code.substring(0, 100)}`,
        response: content,
        model: 'gpt-4',
        tokens: completion.usage?.total_tokens || 0,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    })

    res.json({
      success: true,
      data: response
    })
  } catch (error) {
    logger.error('AI suggest error:', error)
    res.status(500).json({
      success: false,
      error: { message: 'Failed to generate suggestion' }
    })
  }
})

export { router as aiRoutes }
