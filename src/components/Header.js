
'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTranslation } from '../contexts/TranslationContext'
import { useAuth } from '../contexts/AuthContext'
import { BsFilterRight } from 'react-icons/bs'
import { IoClose } from 'react-icons/io5'
import { IoIosArrowDown } from 'react-icons/io'

export default function Header() {
  const router = useRouter()
  const headerRef = useRef(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const dropdownRef = useRef(null)
  const { language, switchLanguage, isTranslating } = useTranslation()
  const { isAuthenticated, isPartner, user, partner } = useAuth()

  // Close mobile menu with animation
  const closeMobileMenu = () => {
    setIsClosing(true)
    setTimeout(() => {
      setMobileMenuOpen(false)
      setIsClosing(false)
    }, 600) // Slower close animation for better visibility
  }

  // Navigation handler
  const handleNavigation = (label) => {
    closeMobileMenu() // Close mobile menu after navigation
    switch (label) {
      case 'Sign In':
        router.push('/login')
        break
      case 'Sign Up':
        router.push('/signup')
        break
      case 'Partner ':
        router.push('/partner-login')
        break
      default:
        break
    }
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Ensure header background color stays consistent when sidebar opens/closes
  useEffect(() => {
    if (headerRef.current) {
      headerRef.current.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
    }
  }, [mobileMenuOpen, isClosing])

  // Profile button click handler
  const handleProfileClick = () => {
    if (isAuthenticated()) {
      if (isPartner()) {
        // Navigate to partner dashboard
        router.push('/partner-dashboard')
      } else {
        // Navigate to user dashboard
        router.push('/dashboard')
      }
    } else {
      // Not logged in, navigate to login page
      router.push('/login')
    }
  }

  // Dropdown menus
  const dropdowns = {
    HOME: [
      { label: 'Privilege Program', path: 'https://privilege.alasmakhrealestate.com', external: true },
    ],
    LISTINGS: [
      { label: 'Rent', path: '/listings/rent' },
      // { label: 'Sale', path: '/listings/sale' },
      { label: 'Sale', path: '/listings/listing-sale' },
      // { label: 'Listing Rent', path: '/listings/listing-rent' },
    ],
    SERVICES: [
      { label: 'Lease', path: '/listings/services-lease' },
      { label: 'Sales', path: '/services/services-sales' },
      { label: 'Marketing', path: '/services/marketing' },
      { label: 'Property Management', path: '/services/propertyManagement' },
    ],
    DEVELOPMENT: [
      { label: 'Luxury', path: '/listings/luxury' },
      { label: 'All Projects', path: '/allprojects' },
      { label: 'Commercial', path: '/commercial' },
      { label: 'Industrial', path: '/industrial' },
      // { label: 'Contact Head Office', path: '/contactheadoffice' },
    ],
    MEDIA: [
      { label: 'Blogs', path: '/listings/blogs' },
    ],
    CONTACT: [
      { label: 'Contact Agent', path: '/contact' },
      { label: 'Contact Head Office', path: '/contactheadoffice' },
    ],
  }

  // Navigation menu items
  const menuItems = [
    { key: 'HOME', label: 'HOME' },
    { key: 'LISTINGS', label: 'LISTINGS' },
    { key: 'SERVICES', label: 'SERVICES' },
    { key: 'DEVELOPMENT', label: 'DEVELOPMENT' },
    { key: 'MEDIA', label: 'MEDIA' },
    { key: 'ABOUT US', label: 'ABOUT US' },
    { key: 'CONTACT', label: 'CONTACT' },
  ]

  // Toggle dropdown
  const toggleDropdown = (key) => {
    setActiveDropdown(activeDropdown === key ? null : key)
  }

  // Handle dropdown item click
  const handleDropdownItemClick = (item) => {
    if (item.external) {
      window.open(item.path, '_blank', 'noopener,noreferrer')
    } else {
      router.push(item.path)
    }
    setActiveDropdown(null)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null)
      }
    }

    if (activeDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [activeDropdown])

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 inset-x-0 z-[60] transition-all duration-300 border border-white/10 shadow-lg backdrop-blur-md ${scrolled
        ? 'rounded-none mt-0'
        : 'rounded-[5px] mt-4'
        }`}
      style={{
        height: '65px',
        minHeight: '65px',
        marginLeft: scrolled ? '0' : 'clamp(0.5rem, 2vw, 1rem)',
        marginRight: scrolled ? '0' : 'clamp(0.5rem, 2vw, 1rem)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
      }}
    >
      <div className="max-w-[1600px] 2xl:max-w-[1920px] 3xl:max-w-[2560px] 4xl:max-w-[2560px] 5xl:max-w-[3200px] 6xl:max-w-[3200px] mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-0 h-full">
        <div className="flex items-center justify-between h-full">

          {/* ✅ Mobile Logo on Start - Increased size */}
          <div
            className="flex md:hidden order-1 relative w-44 h-12 cursor-pointer items-center justify-center"
            onClick={() => router.push('/')}
          >
            <Image
              src="/images/Al-asmakh.png"
              alt="Al-Asmakh Logo"
              fill
              className="object-contain"
              style={{ paddingRight: "122px" }}
            />
          </div>

          {/* ✅ Mobile Menu Icon on End - Shows close icon when menu is open */}
          <div className="md:hidden order-2 flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-white/20 transition-all duration-300"
              style={{ color: '#001730' }}
              onClick={() => {
                if (mobileMenuOpen) {
                  closeMobileMenu()
                } else {
                  setMobileMenuOpen(true)
                }
              }}
            >
              {mobileMenuOpen ? (
                <IoClose className="h-8 w-8 transition-all duration-300" />
              ) : (
                <BsFilterRight className="h-8 w-8 transition-all duration-300" />
              )}
            </button>
          </div>

          {/* Desktop Logo - Left aligned with spacing */}
          <div
            className="hidden md:flex flex-shrink-0 relative w-48 md:w-[300px] h-full z-[100] cursor-pointer items-center justify-center"
            onClick={() => router.push('/')}
            style={{ marginLeft: '0', marginRight: '0' }}
          >
            <div className="relative w-full h-14  md:h-[210px] flex items-center justify-center md:mb-1">
              <Image
                src="/images/Al-asmakh.png"
                alt="Al-Asmakh Logo"
                fill
                className="object-contain"
                priority
                style={{ paddingRight: "220px" }}
              />
            </div>
          </div>

          {/* Desktop Center Navigation Menu */}
          <div className="hidden md:flex items-center gap-2 flex-1 justify-center" ref={dropdownRef}>
            {menuItems.map((item) => {
              const hasDropdown = dropdowns[item.key] && dropdowns[item.key].length > 0

              return (
                <div key={item.key} className="relative">
                  <button
                    onClick={() => hasDropdown ? toggleDropdown(item.key) : router.push(item.key === 'HOME' ? '/' : `/${item.key.toLowerCase().replace(' ', '-')}`)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-300 ${activeDropdown === item.key
                      ? 'bg-white/20 text-[#001730]'
                      : 'hover:bg-white/10 text-[#001730]'
                      }`}
                    style={{ fontSize: 'clamp(11px, 0.8vw, 14px)', fontWeight: '500' }}
                  >
                    <span>{item.label}</span>
                    {hasDropdown && (
                      <IoIosArrowDown
                        className={`w-3 h-3 transition-transform duration-300 ${activeDropdown === item.key ? 'rotate-180' : ''
                          }`}
                      />
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {hasDropdown && activeDropdown === item.key && (
                    <div
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 min-w-[200px] rounded-lg shadow-lg z-50 border border-white/20"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.25)',
                        backdropFilter: 'blur(30px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                      }}
                    >
                      <div className="py-2">
                        {dropdowns[item.key].map((dropdownItem, index) => (
                          <button
                            key={index}
                            onClick={() => handleDropdownItemClick(dropdownItem)}
                            className="w-full text-left px-4 py-2 text-sm text-[#001730] hover:bg-white/20 transition-colors duration-200"
                          >
                            {dropdownItem.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Desktop End Section */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Selector */}
            <div
              className={`flex items-center gap-1 whitespace-nowrap font-semibold rounded-lg px-2 py-1 ${isTranslating ? 'opacity-50 pointer-events-none' : ''
                }`}
              style={{ fontSize: 'clamp(10px, 0.7vw, 14px)', color: '#001730', letterSpacing: '0.1px' }}
            >
              <button onClick={() => switchLanguage('en')} disabled={isTranslating}>
                EN
              </button>
              <span className="mx-1 text-[#001730]">|</span>
              <button
                onClick={() => switchLanguage('ar')}
                disabled={isTranslating}
                className={`${language === 'ar' ? 'font-semibold' : ''}`}
              >
                AR
              </button>
              {isTranslating && (
                <div className="ms-1">
                  <svg
                    className="animate-spin h-3 w-3 text-[#001730]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Profile Icon */}
            <button
              onClick={handleProfileClick}
              className="p-1 hover:bg-gray-300 transition-all duration-300 flex items-center justify-center cursor-pointer"
              style={{
                color: '#001730',
                border: '0.2px solid #001730',
                borderRadius: '5px',
                width: '26px',
                height: '26px',
              }}
              title={isAuthenticated() ? (isPartner() ? 'Partner Dashboard' : 'User Dashboard') : 'Login'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop Overlay - With closing animation - Below header */}
      {(mobileMenuOpen || isClosing) && (
        <div
          className={`fixed inset-0  z-[45] transition-opacity duration-600 ease-in-out ${isClosing ? 'opacity-0' : 'opacity-100'
            }`}
          onClick={closeMobileMenu}
          style={{
            pointerEvents: isClosing ? 'none' : 'auto',
            transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
      )}

      {/* Mobile Menu - Enhanced glassmorphism effect with closing animation */}
      {(mobileMenuOpen || isClosing) && (
        <div
          className={`fixed top-0 h-screen w-[80%] max-w-[400px] z-50 
            transform transition-all duration-600 ease-in-out
          ${language === 'ar'
              ? 'left-0'
              : 'right-0'
            }
          ${language === 'ar'
              ? (isClosing ? '-translate-x-full opacity-0 scale-95' : 'translate-x-0 opacity-100 scale-100')
              : (isClosing ? 'translate-x-full opacity-0 scale-95' : 'translate-x-0 opacity-100 scale-100')
            }`}
          style={{
            background: 'rgba(107, 107, 107, 0.87)',
            borderRadius: language === 'ar' ? '16px 0 0 16px' : '0 16px 16px 0',
            boxShadow: isClosing
              ? '0 4px 30px rgba(0, 0, 0, 0.05)'
              : '0 4px 30px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(18.5px)',
            WebkitBackdropFilter: 'blur(18.5px)',
            border: '1px solid rgba(107, 107, 107, 0.96)',
            pointerEvents: isClosing ? 'none' : 'auto',
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), scale 0.6s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            transformOrigin: language === 'ar' ? 'left center' : 'right center',
          }}
        >
          <div className="relative h-full flex flex-col p-6 text-white">
            {/* Close Icon on Start - Mobile */}
            <button
              onClick={closeMobileMenu}
              className={`absolute top-6 md:hidden p-2 rounded-md hover:bg-white/20 transition-all duration-300 z-10 ${language === 'ar' ? 'right-6' : 'left-6'
                }`}
              aria-label="Close menu"
            >
              <IoClose className="h-6 w-6 text-white" />
            </button>

            {/* Logo Section - Align to End */}
            <div className="flex flex-col items-end mb-6 w-full">
              <div className="relative w-[140px]">
                <Image
                  src="/images/w-alasmakh.png"
                  alt="Al-Asmakh Logo"
                  width={140}
                  height={50}
                  className="object-contain mb-3"
                />
              </div>
              <div className="w-60 border-b border-white/30 mt-3" />
            </div>

            {/* Menu Content */}
            <div
              className={`flex-1 flex flex-col gap-6 transition-opacity duration-600 ${isClosing ? 'opacity-0' : 'opacity-100'
                }`}
              style={{
                transitionDelay: isClosing ? '0ms' : '0ms',
                transition: 'opacity 0.6s ease-in-out'
              }}
            >
              {/* Privileged Tenet Section */}
              <div className="flex flex-col gap-3">
                <h2 className="text-base font-normal text-white mb-2 ms-auto">Privileged Tenent / Staff</h2>

                <button
                  onClick={() => handleNavigation('Sign In')}
                  className="w-56 ms-auto py-3 px-4 rounded-lg text-start font-normal text-white transition-all duration-300
                           bg-[rgba(160, 166, 176, 0.4)] hover:bg-[rgba(160, 166, 176, 0.5)] 
                           border border-white/20 flex items-center justify-between shadow-sm"
                  style={{ fontSize: '15px' }}
                >
                  <span>Sign In</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 text-white [dir='rtl']:rotate-180"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  onClick={() => handleNavigation('Sign Up')}
                  className="w-56 ms-auto py-3 px-4 rounded-lg text-start font-normal text-white transition-all duration-300
                           bg-[rgba(160, 166, 176, 0.4)] hover:bg-[rgba(160, 166, 176, 0.5)] 
                           border border-white/20 flex items-center justify-between shadow-sm"
                  style={{ fontSize: '15px' }}
                >
                  <span>Sign Up</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 text-white [dir='rtl']:rotate-180"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Partner / Staff Section */}
              <div className="flex flex-col gap-3">
                <h2 className="text-base font-normal text-white mb-2 ms-auto">Partner </h2>

                <button
                  onClick={() => handleNavigation('Partner / Staff')}
                  className="w-56 ms-auto py-3 px-4 rounded-lg text-start font-normal text-white transition-all duration-300
                           bg-[rgba(160, 166, 176, 0.4)] hover:bg-[rgba(160, 166, 176, 0.5)] 
                           border border-white/20 flex items-center justify-between shadow-sm"
                  style={{ fontSize: '15px' }}
                >
                  <span>Log In</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 text-white [dir='rtl']:rotate-180"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Change Language Section */}
              <div className="flex flex-col gap-3 ">
                <h2 className="text-base font-normal text-white mb-2 ms-auto">Change Language</h2>

                {/* Box Switch */}
                <div className="flex items-center gap-2 ms-auto w-56">
                  <button
                    onClick={() => switchLanguage('en')}
                    disabled={isTranslating}
                    className={`px-4 py-2 rounded-md transition-all duration-300 font-medium ${language === 'en'
                      ? 'bg-white text-[#001730] shadow-md'
                      : 'bg-[rgba(160, 166, 176, 0.4)] text-white border border-white/20'
                      } ${isTranslating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/30'}`}
                    style={{ fontSize: '15px' }}
                  >
                    English
                  </button>

                  <button
                    onClick={() => switchLanguage('ar')}
                    disabled={isTranslating}
                    className={`px-4 py-2 rounded-md transition-all duration-300 font-medium ${language === 'ar'
                      ? 'bg-white text-[#001730] shadow-md'
                      : 'bg-[rgba(160, 166, 176, 0.4)] text-white border border-white/20'
                      } ${isTranslating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/30'}`}
                    style={{ fontSize: '15px' }}
                  >
                    Arabic
                  </button>

                  {isTranslating && (
                    <div className="ms-2">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}