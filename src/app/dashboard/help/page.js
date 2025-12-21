'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../../components/Sidebar'
import Image from 'next/image'
import HelpSupport from '../../../components/HelpSupport'
import DashboardHeader from '../../../partner-dashboard/DashboardHeader'
import { useAuth } from '../../../contexts/AuthContext'

export default function HelpPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeMenuItem, setActiveMenuItem] = useState('help')
  
  // Check authentication
  useEffect(() => {
    if (loading) return;
    
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    
    if (!token || (!user && !userData)) {
      router.push('/login');
    }
  }, [loading, user, router])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleMenuItemClick = (itemId) => {
    setActiveMenuItem(itemId)
    
    // Handle navigation for user dashboard
    if (itemId === 'help') {
      router.push('/dashboard/help')
      return
    }
    
    if (itemId === 'create') {
      router.push('/dashboard/edit-profile')
      return
    }
    
    if (itemId === 'dashboard') {
      router.push('/dashboard')
      return
    }
    
    if (itemId === 'offers') {
      router.push('/dashboard/offers')
      return
    }
    
    if (itemId === 'signout') {
      router.push('/')
      return
    }
    
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        activeItem={activeMenuItem}
        onItemClick={handleMenuItemClick}
        userType="user"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0 relative z-0">
        {/* Top Header */}
        <DashboardHeader title="We are Here to Help" description="Get assistance with your questions and issues" onMenuClick={toggleSidebar} userData={user} />

       

        {/* Help & Support Content */}
        <HelpSupport />
      </div>
    </div>
  )
}

