'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../components/Sidebar'
import MyProfileInfo from '../../components/MyProfileInfo'
import DashboardHeader from '../../partner-dashboard/DashboardHeader'       
import Members from '../../partner-dashboard/Members'
import { useAuth } from '../../contexts/AuthContext'

export default function PartnerDashboardPage() {
  const router = useRouter()
  const { partner, loading, isAuthenticated, logout, isPartner } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard')
  
  // Check if user is authenticated and is a partner
  useEffect(() => {
    // Wait for loading to complete
    if (loading) return;
    
    // Check token in localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    const partnerData = localStorage.getItem('partnerData');
    
    // If no token, redirect to login
    if (!token) {
      router.push('/partner-login');
      return;
    }
    
    // If authenticated but has user data instead of partner data, redirect to user dashboard
    if (userData && !partnerData && !partner) {
      router.push('/dashboard');
      return;
    }
    
    // If authenticated but no partner data at all, redirect to partner login
    if (!partner && !partnerData) {
      router.push('/partner-login');
      return;
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
      <div className="flex-1 p-4  flex flex-col min-h-screen lg:ml-0 relative z-0">
        {/* Top Header */}
        <DashboardHeader title="WELCOME BACK !" description="A digital platform designed to reward tenants and staff with exclusive benefits, seamless membership management, and a connected community experience." onMenuClick={toggleSidebar}  userType="partner" partnerData={partner}/>

     


        {/* Main Dashboard Content */}
        <main className="flex-1 p-2">
          {/* Profile Information, ID Card and Your Profile */}
     

     {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <MyProfileInfo 
          userType="partner"
          partnerData={partner}
          profileCardWidth="120%"
          profileCardHeight="300px"
          statsCardHeight="320px"
        />
      )}

       {/* Members Section */}
       <div className="mt-6">
         <Members />
       </div>

         
        </main>
      </div>
    </div>
  )
}