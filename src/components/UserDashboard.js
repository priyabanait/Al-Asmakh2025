'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from './Sidebar'
import MyProfileInfo from './MyProfileInfo'
import DashboardHeader from '../partner-dashboard/DashboardHeader'
import Offers from '../dashboard/Offers'
import Partner from '../partner-dashboard/Partner'
import Image from 'next/image'
import Footer from './Footer'
import { useAuth } from '../contexts/AuthContext'
import { FaArrowRight } from "react-icons/fa6";

export default function UserDashboard() {
  const router = useRouter()
  const { user, loading, isAuthenticated, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard')
  const [offers, setOffers] = useState([])
  const [offersLoading, setOffersLoading] = useState(true)
  
  // Check if user is authenticated and is a regular user
  useEffect(() => {
    // Wait for loading to complete
    if (loading) return;
    
    // Check token in localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    const partnerData = localStorage.getItem('partnerData');
    
    // If no token, redirect to login
    if (!token) {
      router.push('/login');
      return;
    }
    
    // If authenticated but no user data and has partner data, redirect to partner dashboard
    if (!user && partnerData) {
      router.push('/partner-dashboard');
      return;
    }
    
    // If authenticated but no user data at all, redirect to login
    if (!user && !userData) {
      router.push('/login');
      return;
    }
  }, [loading, user, router])

  // Fetch offers from API
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setOffersLoading(true)
        const response = await fetch('https://albackend.x-360.ai/api/offers')
        const data = await response.json()

        if (response.ok && data.success && data.data) {
          // Get only first 3 offers
          setOffers(data.data.slice(0, 3))
        } else {
          setOffers([])
        }
      } catch (err) {
        console.error('Error fetching offers:', err)
        setOffers([])
      } finally {
        setOffersLoading(false)
      }
    }

    fetchOffers()
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleMenuItemClick = (itemId) => {
    setActiveMenuItem(itemId)
    
    // Handle navigation for user dashboard
    if (itemId === 'create') {
      router.push('/dashboard/edit-profile')
      return
    }
    
    if (itemId === 'help') {
      router.push('/dashboard/help')
      return
    }
    
    if (itemId === 'offers') {
      router.push('/dashboard/offers')
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

    <>
    
    
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
        <DashboardHeader title="WELCOME BACK !" description="A digital platform designed to reward tenants and staff with exclusive benefits, seamless membership management, and a connected community experience." onMenuClick={toggleSidebar} userData={user} />

     


        {/* Main Dashboard Content */}
        <main className="flex-1  lg:p-3">
          {/* Profile Information, ID Card and Your Profile */}
     

     {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <MyProfileInfo
            userData={user}
            profileCardHeight="300px"
            statsCardHeight="300px"
          />
        )}
 

       

          <div className="mb-6 bg-white p-5" style={{borderRadius: "5px"}}>
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-medium text-gray-900">Offers</h2>
      </div>
      {/* <div className="flex space-x-1">
        <button className="p-1 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div> */}
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 justify-items-center">
      {offersLoading ? (
        <div className="col-span-full text-center py-8">
          <p className="text-gray-500">Loading offers...</p>
        </div>
      ) : offers.length === 0 ? (
        <div className="col-span-full text-center py-8">
          <p className="text-gray-500">No offers available at the moment.</p>
        </div>
      ) : (
        offers.map((offer) => (
          <div
            key={offer._id}
            className="bg-white rounded-lg shadow overflow-hidden w-[90%] sm:w-[300px] md:w-[320px] relative"
          >
            <div className="relative h-[200px] sm:h-[220px] md:h-[240px]">
              {/* Offer Image */}
              {offer.imageurl ? (
                <Image
                  src={offer.imageurl}
                  alt={offer.title || 'Offer Image'}
                  fill
                  className="object-cover rounded-lg"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    e.target.src = '/images/placeholder.svg'
                  }}
                />
              ) : (
                <Image
                  src="/images/placeholder.svg"
                  alt="Placeholder"
                  fill
                  className="object-cover rounded-lg"
                />
              )}

              {/* Explore Button */}
              <button
                className="absolute top-4 left-3 z-10 flex items-center justify-between text-white text-xs sm:text-[9px] font-medium px-2 py-1"
                style={{
                  backgroundColor: "#001730",
                  borderRadius: "5px",
                  width: "100px",
                  height: "25px",
                }}
              >
                <span>Explore</span>
                <FaArrowRight fontSize={12} />
              </button>

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-[#9C9B9C]/90 text-white p-3 rounded-b-lg">
                <h3 className="text-xs sm:text-sm font-medium mb-1">
                  {offer.title || 'No Title'}
                </h3>
                <div className="border-t border-gray-200 mb-1"></div>
                <p className="text-[8px] sm:text-[10px] leading-tight">
                  {offer.description || 'No description available.'}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>

  </div>
       

          {/* Our Partners Section */}
          {/* <div className="mb-6">
         <Partner/>
          </div> */}
        </main>

      </div>
    </div>
    <Footer />


    </>
  )
}