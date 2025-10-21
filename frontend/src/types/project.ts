export interface Project {
  id: string
  name: string
  description?: string
  isPublic: boolean
  ownerId: string
  owner: {
    id: string
    name: string
    avatar?: string
  }
  files: ProjectFile[]
  collaborators: Collaborator[]
  createdAt: string
  updatedAt: string
  lastModified: string
}

export interface ProjectFile {
  id: string
  name: string
  path: string
  content: string
  language: string
  size: number
  isDirectory: boolean
  children?: ProjectFile[]
  createdAt: string
  updatedAt: string
}

export interface Collaborator {
  id: string
  user: {
    id: string
    name: string
    avatar?: string
  }
  role: 'owner' | 'editor' | 'viewer'
  joinedAt: string
}

export interface CreateProjectRequest {
  name: string
  description?: string
  isPublic: boolean
  template?: string
}

export interface UpdateProjectRequest {
  name?: string
  description?: string
  isPublic?: boolean
}

export interface ProjectTemplate {
  id: string
  name: string
  description: string
  files: ProjectFile[]
  category: 'web' | 'mobile' | 'desktop' | 'ai' | 'data' | 'other'
}
