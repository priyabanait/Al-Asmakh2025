'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'

export default function DemoPage({ title = "Demo Page", children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard')

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleMenuItemClick = (itemId) => {
    setActiveMenuItem(itemId)
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Reusable Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        activeItem={activeMenuItem}
        onItemClick={handleMenuItemClick}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* Mobile Menu Button */}
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors mr-4"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <div>
                <h1 className="text-xl lg:text-2xl font-semibold text-gray-900">{title}</h1>
                <p className="text-sm text-gray-600 mt-1">This demonstrates the reusable sidebar component</p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              {/* Profile */}
              <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">JD</span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500">User</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6">
          {children || (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Reusable Sidebar Demo</h2>
              <p className="text-gray-600 mb-6">
                This page demonstrates how the Sidebar component can be reused across different pages 
                with the same design and functionality.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                <div className="p-6 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Responsive Design</h3>
                  <p className="text-blue-700 text-sm">
                    The sidebar adapts to different screen sizes with mobile-first approach.
                  </p>
                </div>
                <div className="p-6 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">Reusable Component</h3>
                  <p className="text-green-700 text-sm">
                    Same sidebar can be used across multiple pages with consistent styling.
                  </p>
                </div>
                <div className="p-6 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">Interactive</h3>
                  <p className="text-purple-700 text-sm">
                    Clickable navigation items with active states and smooth transitions.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
