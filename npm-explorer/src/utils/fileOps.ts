import type { File } from '../types/files'

export function getIconForFile(file: File) {
  if (file.trash === true) {
    return 'delete'
  }

  if (file.type === 'directory') {
    return file.opened ? 'folder-open' : 'folder'
  }

  const type = file.contentType || ''

  return /javascript$|json$|jsx$/.test(type)
    ? 'file-js'
    : /css$|sass$|scss$/.test(type)
    ? 'file-ml'
    : /xml$|html$|htm$/.test(type)
    ? 'file-ml'
    : /^image/.test(type)
    ? 'file-img'
    : /^text/.test(type)
    ? 'file-txt'
    : 'file'
}

export function getFileName(file: File) {
  const name = file.path.match(/\/?([^/]*)$/) || []

  return name[1] || '???'
}

export function sortFiles(files: File[]) {
  if (files.length === 0) return files

  files.sort((a, b) => {
    if (a.files && !b.files) return -1
    if (b.files && !a.files) return 1
    return a.path.localeCompare(b.path)
  })

  return files
}

/**
 * @param {*[]} files
 * @param {string} path
 */
export function openTreeToFile(files: File[], path: string): File | null {
  for (let file of files || []) {
    if (path.indexOf(file.path) === 0) {
      if (file.type === 'directory') {
        file.opened = true
        return openTreeToFile(file.files, path)
      } else if (path.length !== file.path.length) {
        return null
      }
      return file
    }
  }

  return null
}
