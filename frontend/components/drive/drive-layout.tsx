'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

interface DriveLayoutProps {
  children: React.ReactNode
}

export default function DriveLayout({ children }: DriveLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4 max-w-full">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">OKM</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hidden sm:inline">
                OKM
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-600">OKM</p>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-64 bg-white border-r shadow-sm p-4 hidden lg:block sticky top-24 h-[calc(100vh-96px)]">
            <nav className="space-y-2">
              <a
                href="/drive"
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-medium border border-blue-200 hover:shadow-sm transition"
              >
                <span className="text-lg">📁</span>
                My Drive
              </a>
              <a
                href="/drive"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                <span className="text-lg">⭐</span>
                Starred
              </a>
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
