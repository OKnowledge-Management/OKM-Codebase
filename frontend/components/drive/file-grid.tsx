'use client'

import { useState } from 'react'
import { api, DriveItem } from '@/lib/api'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Folder, File, Trash2, Download, Copy, Move, Edit } from 'lucide-react'
import FilePreview from './file-preview'

interface FileGridProps {
  items: DriveItem[]
  onRefresh: () => void
  currentFolderId: string | null
  onNavigate: (folderId: string | null) => void
}

export default function FileGrid({
  items,
  onRefresh,
  currentFolderId,
  onNavigate,
}: FileGridProps) {
  const [selectedItem, setSelectedItem] = useState<DriveItem | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: DriveItem } | null>(null)
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [newName, setNewName] = useState('')

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const handleContextMenu = (e: React.MouseEvent, item: DriveItem) => {
    e.preventDefault()
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item,
    })
  }

  const handleRename = async (item: DriveItem) => {
    if (!newName.trim() || newName === item.name) {
      setRenamingId(null)
      return
    }
    try {
      await api.renameItem(item.id, newName, item.type)
      setRenamingId(null)
      setNewName('')
      onRefresh()
    } catch (error) {
      console.error('Failed to rename item:', error)
    }
  }

  const handleDelete = async (item: DriveItem) => {
    try {
      await api.deleteItem(item.id, item.type)
      setContextMenu(null)
      onRefresh()
    } catch (error) {
      console.error('Failed to delete item:', error)
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Folder className="w-10 h-10 text-gray-400" />
        </div>
        <p className="text-gray-600 font-medium text-lg">No files or folders yet</p>
        <p className="text-gray-500 text-sm mt-1">Start by uploading files or creating a new folder</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <Card
            key={item.id}
            className="p-4 hover:shadow-lg hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 cursor-pointer group relative border-gray-200 hover:border-blue-300"
            onDoubleClick={() => {
              if (item.type === 'folder') {
                onNavigate(item.id)
              }
            }}
            onContextMenu={(e) => handleContextMenu(e, item)}
            onClick={() => {
              if (item.type === 'file') {
                setSelectedItem(item)
                setPreviewOpen(true)
              }
            }}
          >
            <div className="flex flex-col items-center gap-3">
              <div className={`p-3 rounded-lg transition-all ${
                item.type === 'folder' 
                  ? 'bg-blue-100 group-hover:bg-blue-200' 
                  : 'bg-gray-100 group-hover:bg-gray-200'
              }`}>
                {item.type === 'folder' ? (
                  <Folder className="w-8 h-8 text-blue-600" />
                ) : (
                  <File className="w-8 h-8 text-gray-600" />
                )}
              </div>

              <div className="text-center w-full">
                {renamingId === item.id ? (
                  <Input
                    value={newName || item.name}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleRename(item)
                      if (e.key === 'Escape') setRenamingId(null)
                    }}
                    onBlur={() => handleRename(item)}
                    className="text-center text-sm h-6 py-0 px-1"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <p 
                    className="font-medium text-sm truncate cursor-text hover:bg-blue-50 px-1 py-0.5 rounded" 
                    title={item.name}
                    onDoubleClick={() => {
                      setRenamingId(item.id)
                      setNewName(item.name)
                    }}
                  >
                    {item.name}
                  </p>
                )}
              </div>

              <p className="text-xs text-gray-500 text-center">
                {item.type === 'folder' ? 'Folder' : formatFileSize(item.fileSize || 0)}
              </p>
              <p className="text-xs text-gray-400 text-center">
                {formatDate(item.createdAt)}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-white rounded-lg shadow-xl border border-gray-300 z-50 overflow-hidden backdrop-blur-sm"
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          onClick={() => setContextMenu(null)}
        >
          <div className="py-1 min-w-max">
            {contextMenu.item.type === 'file' && (
              <button className="flex items-center gap-3 px-4 py-2 hover:bg-blue-50 w-full text-left text-sm text-gray-700 hover:text-blue-700 transition">
                <Download className="w-4 h-4" /> Download
              </button>
            )}
            <button 
              className="flex items-center gap-3 px-4 py-2 hover:bg-blue-50 w-full text-left text-sm text-gray-700 hover:text-blue-700 transition"
              onClick={() => {
                setRenamingId(contextMenu.item.id)
                setNewName(contextMenu.item.name)
                setContextMenu(null)
              }}
            >
              <Edit className="w-4 h-4" /> Rename
            </button>
            <button className="flex items-center gap-3 px-4 py-2 hover:bg-blue-50 w-full text-left text-sm text-gray-700 hover:text-blue-700 transition">
              <Copy className="w-4 h-4" /> Copy
            </button>
            <button className="flex items-center gap-3 px-4 py-2 hover:bg-blue-50 w-full text-left text-sm text-gray-700 hover:text-blue-700 transition">
              <Move className="w-4 h-4" /> Move
            </button>
            <div className="border-t border-gray-200" />
            <button
              className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 w-full text-left text-sm text-red-600 hover:text-red-700 transition"
              onClick={() => handleDelete(contextMenu.item)}
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>
      )}

      {/* File Preview */}
      {previewOpen && selectedItem && (
        <FilePreview item={selectedItem} onClose={() => setPreviewOpen(false)} />
      )}
    </>
  )
}
