'use client'

import { useState, useEffect } from 'react'
import { api, DriveItem } from '@/lib/api'
import DriveLayout from '@/components/drive/drive-layout'
import FileGrid from '@/components/drive/file-grid'
import UploadArea from '@/components/drive/upload-area'
import FolderNav from '@/components/drive/folder-nav'
import AdvancedSearch from '@/components/drive/advanced-search'
import Breadcrumb from '@/components/drive/breadcrumb'
import TrashButton from '@/components/drive/trash-button'

interface SearchFilters {
  query: string
  fileType: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

interface BreadcrumbItem {
  id: string | null
  name: string
}

export default function DrivePage() {
  const [items, setItems] = useState<DriveItem[]>([])
  const [folders, setFolders] = useState<DriveItem[]>([])
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [folderPath, setFolderPath] = useState<BreadcrumbItem[]>([])
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    fileType: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadItems()
  }, [currentFolderId, filters])

  const loadItems = async () => {
    setLoading(true)
    try {
      const data = await api.fetchItems(currentFolderId)
      let itemsToDisplay = data.items

      // Apply search filter (Client-side for now)
      if (filters.query) {
        itemsToDisplay = itemsToDisplay.filter((item: DriveItem) =>
          item.name.toLowerCase().includes(filters.query.toLowerCase())
        )
      }

      // Apply file type filter (Client-side for now)
      if (filters.fileType) {
        itemsToDisplay = itemsToDisplay.filter((item: DriveItem) =>
          item.type === filters.fileType || (item.fileType?.includes(filters.fileType))
        )
      }

      // Separate files and folders
      const foldersData = itemsToDisplay.filter((item: DriveItem) => item.type === 'folder')
      const filesData = itemsToDisplay.filter((item: DriveItem) => item.type === 'file')

      // Apply sorting
      const sortedItems = [...foldersData, ...filesData].sort((a: DriveItem, b: DriveItem) => {
        let compareValue = 0
        if (filters.sortBy === 'createdAt') {
          compareValue = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        } else if (filters.sortBy === 'name') {
          compareValue = a.name.localeCompare(b.name)
        } else if (filters.sortBy === 'size') {
          compareValue = (b.fileSize || 0) - (a.fileSize || 0)
        }
        return filters.sortOrder === 'asc' ? -compareValue : compareValue
      })

      setFolders(foldersData)
      setItems(filesData)
    } catch (error) {
      console.error('Failed to load items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFolderNavigate = (folderId: string | null) => {
    setCurrentFolderId(folderId)
    if (folderId === null) {
      setFolderPath([])
    }
  }

  const handleSearchFilters = (newFilters: SearchFilters) => {
    setFilters(newFilters)
  }

  return (
    <DriveLayout>
      <div className="space-y-4">
        <AdvancedSearch onSearch={handleSearchFilters} />
        <Breadcrumb items={folderPath} onNavigate={handleFolderNavigate} />
        <div className="flex gap-2 items-center justify-between">
          <FolderNav currentFolderId={currentFolderId} onNavigate={handleFolderNavigate} onSuccess={loadItems} />
          <TrashButton />
        </div>
        <UploadArea currentFolderId={currentFolderId} onUploadSuccess={loadItems} />
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading files...</p>
          </div>
        ) : (
          <FileGrid
            items={[...folders, ...items]}
            onRefresh={loadItems}
            currentFolderId={currentFolderId}
            onNavigate={handleFolderNavigate}
          />
        )}
      </div>
    </DriveLayout>
  )
}
