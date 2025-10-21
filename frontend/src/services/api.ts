import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth'
import { Project, CreateProjectRequest, UpdateProjectRequest } from '../types/project'
import { AIRequest, AIResponse } from '../types/editor'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
    })

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // Auth endpoints
  async getCurrentUser() {
    const response = await this.client.get('/auth/me')
    return response.data
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.client.post('/auth/login', credentials)
    return response.data
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.client.post('/auth/register', data)
    return response.data
  }

  async loginWithGoogle(): Promise<AuthResponse> {
    const response = await this.client.post('/auth/google')
    return response.data
  }

  async loginWithGitHub(): Promise<AuthResponse> {
    const response = await this.client.post('/auth/github')
    return response.data
  }

  async logout() {
    await this.client.post('/auth/logout')
  }

  // Project endpoints
  async getProjects(): Promise<Project[]> {
    const response = await this.client.get('/projects')
    return response.data
  }

  async getProject(id: string): Promise<Project> {
    const response = await this.client.get(`/projects/${id}`)
    return response.data
  }

  async createProject(data: CreateProjectRequest): Promise<Project> {
    const response = await this.client.post('/projects', data)
    return response.data
  }

  async updateProject(id: string, data: UpdateProjectRequest): Promise<Project> {
    const response = await this.client.put(`/projects/${id}`, data)
    return response.data
  }

  async deleteProject(id: string): Promise<void> {
    await this.client.delete(`/projects/${id}`)
  }

  async getProjectFiles(id: string) {
    const response = await this.client.get(`/projects/${id}/files`)
    return response.data
  }

  async updateProjectFile(id: string, filePath: string, content: string) {
    const response = await this.client.put(`/projects/${id}/files`, {
      path: filePath,
      content,
    })
    return response.data
  }

  async createProjectFile(id: string, filePath: string, content: string) {
    const response = await this.client.post(`/projects/${id}/files`, {
      path: filePath,
      content,
    })
    return response.data
  }

  async deleteProjectFile(id: string, filePath: string) {
    await this.client.delete(`/projects/${id}/files`, {
      data: { path: filePath },
    })
  }

  // AI endpoints
  async getAISuggestion(request: AIRequest): Promise<AIResponse> {
    const response = await this.client.post('/ai/suggest', request)
    return response.data
  }

  async getCodeExplanation(code: string, language: string): Promise<string> {
    const response = await this.client.post('/ai/explain', { code, language })
    return response.data.explanation
  }

  async getCodeRefactor(code: string, language: string, context?: string): Promise<string> {
    const response = await this.client.post('/ai/refactor', { code, language, context })
    return response.data.refactoredCode
  }

  async getCodeCompletion(code: string, language: string, position: any): Promise<string[]> {
    const response = await this.client.post('/ai/complete', { code, language, position })
    return response.data.completions
  }
}

export const apiClient = new ApiClient()

// Export specific API modules
export const authApi = {
  getCurrentUser: () => apiClient.getCurrentUser(),
  login: (email: string, password: string) => apiClient.login({ email, password }),
  register: (email: string, password: string, name: string) => 
    apiClient.register({ email, password, name }),
  loginWithGoogle: () => apiClient.loginWithGoogle(),
  loginWithGitHub: () => apiClient.loginWithGitHub(),
  logout: () => apiClient.logout(),
}

export const projectApi = {
  getProjects: () => apiClient.getProjects(),
  getProject: (id: string) => apiClient.getProject(id),
  createProject: (data: CreateProjectRequest) => apiClient.createProject(data),
  updateProject: (id: string, data: UpdateProjectRequest) => apiClient.updateProject(id, data),
  deleteProject: (id: string) => apiClient.deleteProject(id),
  getProjectFiles: (id: string) => apiClient.getProjectFiles(id),
  updateProjectFile: (id: string, filePath: string, content: string) => 
    apiClient.updateProjectFile(id, filePath, content),
  createProjectFile: (id: string, filePath: string, content: string) => 
    apiClient.createProjectFile(id, filePath, content),
  deleteProjectFile: (id: string, filePath: string) => 
    apiClient.deleteProjectFile(id, filePath),
}

export const aiApi = {
  getSuggestion: (request: AIRequest) => apiClient.getAISuggestion(request),
  getCodeExplanation: (code: string, language: string) => 
    apiClient.getCodeExplanation(code, language),
  getCodeRefactor: (code: string, language: string, context?: string) => 
    apiClient.getCodeRefactor(code, language, context),
  getCodeCompletion: (code: string, language: string, position: any) => 
    apiClient.getCodeCompletion(code, language, position),
}
