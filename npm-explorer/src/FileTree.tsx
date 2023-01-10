import { useEffect, useState } from 'react'
import { colorCodeItem, getReadableSize } from './utils/etc'
import { getFileName, getIconForFile, sortFiles } from './utils/fileOps'
import type { File, Package } from './types/files'

interface Props {
  data: Package
  layout: string
  files: File[]
  selectedFile: File
  onFileSelect?: (fileItem: File) => void
}

export function FileTree({ files, ...props }: Props) {
  const [fileTree, setFileTree] = useState<File[]>([])
  const [paths, setPaths] = useState<string[]>([])

  const onFileItemClick = (fileItem: File) => {
    console.log(fileItem)
    if (fileItem.path === '..') {
      setPaths(paths.splice(-1))
      return
    }

    if (fileItem.type !== 'directory') {
      if (props.onFileSelect) props.onFileSelect(fileItem)
      return
    }

    if (props.layout === 'mobile') {
      setPaths([...paths, getFileName(fileItem)])
    } else {
      fileItem.opened = !fileItem.opened
    }
  }

  useEffect(() => {
    console.log(paths)
  }, [paths])

  useEffect(() => {
    let tempFiles

    for (const path of paths) {
      for (const file of files) {
        if (getFileName(file) === path && file.type === 'directory') {
          tempFiles = file.files
          break
        }
      }
    }

    tempFiles = sortFiles(files)

    if (paths.length > 0) {
      // !FIXME
      // @ts-ignore
      files.unshift({
        path: '..',
        name: '/' + paths.join('/') + '/..',
        files: [],
        type: 'directory'
      })
    }

    setFileTree(tempFiles)
  }, [files])

  return (
    <ul className="file-tree">
      {fileTree.map((item) => (
        <li
          className="item"
          key={item.path}
        >
          <div
            className={`head ${item === props.selectedFile ? 'selected' : ''}`}
            onClick={() => onFileItemClick(item)}
          >
            <div className={`small icon ${getIconForFile(item)}`} />
            <div
              className="size"
              style={{ color: colorCodeItem(item, props.data) }}
            >
              {item.size ? getReadableSize(item.size) : ''}
            </div>
            <div className="name">{item.name || getFileName(item)}</div>
          </div>
          {!item.opened ||
          !Array.isArray(item.files) ||
          props.layout === 'mobile' ? null : (
            <FileTree
              files={item.files}
              {...props}
            />
          )}
        </li>
      ))}
    </ul>
  )
}
