'use client'

import { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface SearchFilters {
  query: string
  fileType: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void
}

const FILE_TYPES = [
  { label: 'All Files', value: '' },
  { label: 'Images', value: 'image' },
  { label: 'PDFs', value: 'application/pdf' },
  { label: 'Documents', value: 'document' },
  { label: 'Spreadsheets', value: 'spreadsheet' },
  { label: 'Videos', value: 'video' },
  { label: 'Audio', value: 'audio' },
]

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'created_at', order: 'desc' },
  { label: 'Oldest First', value: 'created_at', order: 'asc' },
  { label: 'Name (A-Z)', value: 'name', order: 'asc' },
  { label: 'Name (Z-A)', value: 'name', order: 'desc' },
  { label: 'Size (Small to Large)', value: 'file_size', order: 'asc' },
  { label: 'Size (Large to Small)', value: 'file_size', order: 'desc' },
]

export default function AdvancedSearch({ onSearch }: AdvancedSearchProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    fileType: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
  })

  const handleSearch = (newFilters: Partial<SearchFilters>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    onSearch(updated)
  }

  const handleReset = () => {
    const defaultFilters = {
      query: '',
      fileType: '',
      sortBy: 'created_at',
      sortOrder: 'desc' as const,
    }
    setFilters(defaultFilters)
    onSearch(defaultFilters)
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search files by name, type, or date..."
            value={filters.query}
            onChange={(e) => handleSearch({ query: e.target.value })}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <Filter className="w-4 h-4" />
        </Button>
        {(filters.query || filters.fileType || filters.sortBy !== 'created_at') && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            title="Clear filters"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {showAdvanced && (
        <Card className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">File Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FILE_TYPES.map((type) => (
                <Button
                  key={type.value}
                  variant={filters.fileType === type.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSearch({ fileType: type.value })}
                  className="justify-start"
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Sort By</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SORT_OPTIONS.map((option) => (
                <Button
                  key={`${option.value}-${option.order}`}
                  variant={
                    filters.sortBy === option.value && filters.sortOrder === option.order
                      ? 'default'
                      : 'outline'
                  }
                  size="sm"
                  onClick={() =>
                    handleSearch({
                      sortBy: option.value,
                      sortOrder: option.order as 'asc' | 'desc',
                    })
                  }
                  className="justify-start"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
