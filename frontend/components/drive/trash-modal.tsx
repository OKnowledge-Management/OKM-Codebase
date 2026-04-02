'use client'

import { useEffect, useState } from 'react'
import { X, Trash2, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface TrashItem {
  id: string
  name: string
  type: 'file' | 'folder'
  deletedAt: string
}

interface TrashModalProps {
  onClose: () => void
}

export default function TrashModal({ onClose }: TrashModalProps) {
  const [items, setItems] = useState<TrashItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTrash()
  }, [])

  const loadTrash = async () => {
    try {
      const response = await fetch('/data/drive.json')
      const data = await response.json()
      setItems(data.trash || [])
    } catch (error) {
      console.error('Failed to load trash:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = (item: TrashItem) => {
    alert(`Restored "${item.name}" from trash`)
  }

  const handleDeletePermanent = (item: TrashItem) => {
    alert(`Permanently deleted "${item.name}"`)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-2xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-red-50 to-orange-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Trash</h2>
            <p className="text-sm text-gray-600 mt-1">Items deleted more than 30 days ago will be automatically removed</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 max-h-96 overflow-y-auto">
          {loading ? (
            <p className="text-center text-gray-500">Loading trash...</p>
          ) : items.length === 0 ? (
            <p className="text-center text-gray-500">Trash is empty</p>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Deleted {new Date(item.deletedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestore(item)}
                      className="border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Restore
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleDeletePermanent(item)}
                      title="Delete permanently"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
