'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../../components/Sidebar'
import DashboardHeader from '../../../partner-dashboard/DashboardHeader'
import EditProfile from '../../../components/EditProfile'
import { useAuth } from '../../../contexts/AuthContext'


export default function EditProfilePage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeMenuItem, setActiveMenuItem] = useState('edit-profile')
  
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
    if (itemId === 'offers') {
      router.push('/dashboard/offers')
      return
    }
    
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
        // userType="partner"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0 relative z-0">
        {/* Top Header */}
        <DashboardHeader 
          title="WELCOME BACK !" 
          description="A digital platform designed to reward tenants and staff with exclusive benefits, seamless membership management, and a connected community experience." 
          onMenuClick={toggleSidebar}
          userData={user}
        />

        {/* Edit Profile Content */}

        <div>
          <EditProfile />
        </div>
        
      </div>
    </div>
  )
}
