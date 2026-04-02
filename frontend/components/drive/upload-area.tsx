'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import { api } from '@/lib/api'

interface UploadAreaProps {
  currentFolderId: string | null
  onUploadSuccess: () => void
}

export default function UploadArea({ currentFolderId, onUploadSuccess }: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const uploadFiles = async (files: FileList) => {
    setIsUploading(true)
    try {
      for (let i = 0; i < files.length; i++) {
        await api.uploadFile(files[i], currentFolderId)
      }
      onUploadSuccess()
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files)
    }
  }

  return (
    <Card
      className={`p-12 text-center cursor-pointer transition border-2 border-dashed ${
        isDragging
          ? 'bg-blue-50 border-blue-400 shadow-md'
          : 'bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-md border-blue-200'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div>
          <p className="text-gray-800 font-semibold text-lg">
            Drag files here to upload
          </p>
          <p className="text-sm text-gray-600 mt-1">or click the button below to select files</p>
        </div>
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="file-input"
        />
        <Button
          size="lg"
          onClick={() => document.getElementById('file-input')?.click()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Upload className="w-4 h-4 mr-2" />
          Select Files
        </Button>
      </div>
    </Card>
  )
}
