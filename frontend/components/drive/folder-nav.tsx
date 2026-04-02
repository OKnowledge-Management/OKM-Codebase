import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FolderPlus, ChevronRight } from 'lucide-react'
import { api } from '@/lib/api'

interface FolderNavProps {
  currentFolderId: string | null
  onNavigate: (folderId: string | null) => void
  onSuccess?: () => void
}

export default function FolderNav({ currentFolderId, onNavigate, onSuccess }: FolderNavProps) {
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [folderName, setFolderName] = useState('')

  const handleCreateFolder = async () => {
    if (!folderName.trim()) return
    try {
      await api.createFolder(folderName, currentFolderId)
      setFolderName('')
      setIsCreatingFolder(false)
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error('Failed to create folder:', error)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsCreatingFolder(!isCreatingFolder)}
      >
        <FolderPlus className="w-4 h-4 mr-2" />
        New Folder
      </Button>

      {isCreatingFolder && (
        <div className="flex gap-2 items-center">
          <input
            placeholder="Folder name..."
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <Button
            size="sm"
            onClick={handleCreateFolder}
            variant="default"
          >
            Create
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setIsCreatingFolder(false)
              setFolderName('')
            }}
          >
            Cancel
          </Button>
        </div>
      )}

      {currentFolderId && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate(null)}
        >
          <ChevronRight className="w-4 h-4" />
          Back to Root
        </Button>
      )}
    </div>
  )
}
