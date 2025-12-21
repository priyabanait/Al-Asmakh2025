'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../../components/Sidebar'
import DashboardHeader from '../../../partner-dashboard/DashboardHeader'
import PartnerEditProfile from '../../../components/PartnerEditProfile'
import { useAuth } from '../../../contexts/AuthContext'


export default function PartnerEditProfilePage() {
  const router = useRouter()
  const { partner, loading, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeMenuItem, setActiveMenuItem] = useState('edit-profile')
  
  // Check authentication
  useEffect(() => {
    if (loading) return;
    
    const token = localStorage.getItem('token');
    const partnerData = localStorage.getItem('partnerData');
    
    if (!token || (!partner && !partnerData)) {
      router.push('/partner-login');
    }
  }, [loading, partner, router])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }
  const handleMenuItemClick = (itemId) => {
    setActiveMenuItem(itemId)
    
    // Handle navigation for partner dashboard
    if (itemId === 'scan-member') {
      router.push('/dashboard/scan-member')
      return
    }

    if (itemId === 'dashboard') {
      router.push('/partner-dashboard')
      return
    }
    
    if (itemId === 'edit-profile') {
      router.push('/partner-dashboard/edit-profile')
      return
    }
    
    if (itemId === 'signout') {
      logout()
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
        userType="partner"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0 relative z-0">
        {/* Top Header */}
        <DashboardHeader 
          title="WELCOME BACK !" 
          description="A digital platform designed to reward tenants and staff with exclusive benefits, seamless membership management, and a connected community experience." 
          onMenuClick={toggleSidebar}
          userType="partner"
          partnerData={partner}
        />

        {/* Partner Edit Profile Content */}
        <PartnerEditProfile />
      </div>
    </div>
  )
}
