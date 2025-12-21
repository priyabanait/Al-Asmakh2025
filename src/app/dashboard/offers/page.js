'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../../components/Sidebar'
import Image from 'next/image'
import DashboardHeader from '../../../partner-dashboard/DashboardHeader'
import { useAuth } from '../../../contexts/AuthContext'

export default function OffersPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeMenuItem, setActiveMenuItem] = useState('offers')
  
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

    // Handle navigation
    const routes = {
      offers: '/dashboard/offers',
      help: '/dashboard/help',
      create: '/dashboard/edit-profile',
      dashboard: '/dashboard',
      signout: '/',
    }

    if (routes[itemId]) {
      router.push(routes[itemId])
    }

    if (window.innerWidth < 1024) setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-100  flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        activeItem={activeMenuItem}
        onItemClick={handleMenuItemClick}
        userType="user"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0 relative mb-10 z-0">
        <DashboardHeader
          title="Exclusive Offers & Deals"
          description="Discover amazing benefits and promotions designed for you"
          onMenuClick={toggleSidebar}
          userData={user}
        />

        <div className="mb-6 m-3 bg-white p-5" style={{borderRadius: '5px'}}>
          {/* Header */}
          <div className="flex justify-between items-center mb-7 flex-wrap gap-2">
            <h2 className="text-lg font-medium text-gray-900">
              Explore Offers for the Members
            </h2>

            <div className="flex space-x-3">
              {/* Category Button */}
              <button className="flex items-center px-4 py-2 rounded-md bg-[#CAD1D8] text-black text-xs font-semibold focus:outline-none">
                <svg
                  className="mr-1 w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                Category
              </button>

              {/* Sort Button */}
              <button className="flex items-center px-4 py-2 rounded-md bg-[#CAD1D8] text-black text-xs font-semibold focus:outline-none">
                <svg
                  className="mr-1 w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                Date
              </button>
            </div>
          </div>

          {/* Offers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 justify-items-center">
            {[1, 2, 3,4,5,6].map((item) => (
              <div
                key={item}
                className="bg-white  shadow overflow-hidden w-[90%] sm:w-[300px] md:w-[320px] relative" style={{borderRadius: '5px'}}
              >
                <div className="relative h-[200px] sm:h-[220px] md:h-[240px]">
                  {/* Property Image */}
                  <Image
                    src="/images/sample.jpg" // replace this with your actual image path
                    // alt="Property"
                    fill
                    className="object-cover rounded-lg"
                  />

                  {/* Explore Button */}
                  <button
                    className="absolute top-4 left-3 z-10 flex items-center justify-between text-white text-[3px] sm:text-sm font-medium px-2 py-1"
                    style={{
                      backgroundColor: '#001730',
                      borderRadius: '5px',
                      width: '100px',
                      height: '22px',
                    }}
                  >
                    <span style={{fontSize: '10px'}}>Explore</span>
                    <svg
  style={{ width: '10px', height: '10px', fontSize: '6px' }}
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M9 5l7 7-7 7"
  />
</svg>

                  </button>

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-[#9C9B9C]/90 text-white p-3 rounded-b-lg">
                    <h3 className="text-xs sm:text-sm font-medium mb-1">
                      Smart Investments, Lasting Value
                    </h3>
                    <div className="border-t border-gray-200 mb-1"></div>
                    <p className="text-[8px] sm:text-[10px] leading-tight">
                      Learn how to make informed real estate decisions that build wealth
                      and long-term success in a dynamic property market.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
