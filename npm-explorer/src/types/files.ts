export interface Metadata {
  contentType: string
  integrity: string
  path: string
  size: number
  type: string

  // states
  opened: boolean
  trash: boolean
}

export interface File extends Metadata {
  type: 'file' | 'directory'
  files: File[]
  name?: string
}

export interface Package {
  package: Record<string, unknown>
  files: File[]
  totalSize: number
  totalFiles: number
  totalDirs: number
}
