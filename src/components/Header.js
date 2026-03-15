
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
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState(null)
  const dropdownRef = useRef(null)
  const { language, switchLanguage, isTranslating } = useTranslation()
  const { isAuthenticated, isPartner, user, partner } = useAuth()

  // Close mobile menu with animation
  const closeMobileMenu = () => {
    setIsClosing(true)
    setMobileActiveDropdown(null) // Reset mobile dropdowns when closing menu
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

  // Inject CSS animations for mobile menu
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const styleId = 'mobile-menu-animations'
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style')
        style.id = styleId
        style.textContent = `
          @keyframes slideUpFadeIn {
            0% {
              opacity: 0;
              transform: translateY(28px) scale(0.96);
            }
            60% {
              opacity: 1;
              transform: translateY(-2px) scale(1.01);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `
        document.head.appendChild(style)
      }
    }
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
      // Not logged in, navigate to external login page
      window.open('https://x-360.vercel.app/login', '_blank', 'noopener,noreferrer')
    }
  }

  // Dropdown menus
  const dropdowns = {
    // HOME and ABOUT US are direct links, no dropdowns
    SERVICES: [
      { label: 'Leasing Services', path: '/listings/lease-services' },
      { label: 'Sales Services', path: '/services/services-sales' },
      // { label: 'Project Development', path: '/services/project-devlopment' },
      { label: 'Property Management', path: '/services/propertyManagement' },
      { label: 'Marketing', path: '/services/marketing' },
      { label: 'Facilities Management', path: '/services/facilities-management' },
      // { label: 'Become an Agent', path: '/services/become-an-agent' },

      { label:'Transaction Advisory', path: 'https://www.aredcadvisory.com', external: true },

      { label: 'Other Services', path: '/other-services' },
    ],
    LISTINGS: [
      { label: 'Rent', path: '/listings/rent' },
      { label: 'Sale', path: '/listings/listing-sale' },
      // { label: 'All Listings', path: '/listings/all' },
    ],
    DEVELOPMENT: [
      { label: 'All Projects', path: '/listings/all-projects'},
      { label: 'Luxury Residences', path: '/listings/luxury' },
      { label: 'Commercial', path: '/commercial' },
      { label: 'Industrial', path: '/industrial' },
      { label: 'Mixed-Use', path: '/listings/mixed-use' },
      { label: 'Upcoming', path: '/listings/upcoming' },
    ],
    CONTACT: [
      { label: 'Our Agents', path: '/contact' },
      { label: 'Head Office', path: '/contactheadoffice' },
    ],
    'MEDIA CONTENT': [
      { label: 'Blogs', path: '/listings/blogs' },
      { label: 'Articles', path: '/listings/blogs' },
      { label: 'FAQ', path: '/listings/faq' },
      // {label:'Career', path: '/listings/career'}

    ],
  }

  // Navigation menu items - in order
  const menuItems = [
    { key: 'HOME', label: 'HOME' },
    { key: 'ABOUT US', label: 'ABOUT US' },
    { key: 'SERVICES', label: 'SERVICES' },
    { key: 'LISTINGS', label: 'LISTINGS' },
    { key: 'DEVELOPMENT', label: 'DEVELOPMENT' },
    { key: 'CONTACT', label: 'CONTACT' },
    { key: 'MEDIA CONTENT', label: 'MEDIA CONTENT' },
  ]

  // Toggle dropdown
  const toggleDropdown = (key) => {
    setActiveDropdown(activeDropdown === key ? null : key)
  }

  // Toggle mobile dropdown
  const toggleMobileDropdown = (key) => {
    setMobileActiveDropdown(mobileActiveDropdown === key ? null : key)
  }

  // Handle dropdown item click
  const handleDropdownItemClick = (item) => {
    if (item.external) {
      window.open(item.path, '_blank', 'noopener,noreferrer')
    } else {
      router.push(item.path)
    }
    setActiveDropdown(null)
    closeMobileMenu()
  }

  // Handle mobile dropdown item click
  const handleMobileDropdownItemClick = (item) => {
    if (item.external) {
      window.open(item.path, '_blank', 'noopener,noreferrer')
    } else {
      router.push(item.path)
    }
    setMobileActiveDropdown(null)
    closeMobileMenu()
  }

  // Handle mobile menu item click (for items without dropdowns)
  const handleMobileMenuItemClick = (item) => {
    if (item.key === 'HOME') {
      router.push('/')
    } else if (item.key === 'ABOUT US') {
      router.push('/aboutUs')
    } else {
      router.push(`/${item.key.toLowerCase().replace(' ', '-')}`)
    }
    closeMobileMenu()
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
          <div
            ref={dropdownRef}
            className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2"
          >
            {menuItems.map((item) => {
              const hasDropdown =
                dropdowns[item.key] && dropdowns[item.key].length > 0

              return (
                <div key={item.key} className="relative">
                  <button
                    onClick={() =>
                      hasDropdown
                        ? toggleDropdown(item.key)
                        : router.push(
                          item.key === 'HOME'
                            ? '/'
                            : item.key === 'ABOUT US'
                            ? '/aboutUs'
                            : `/${item.key.toLowerCase().replace(' ', '-')}`
                        )
                    }
                    className={`flex items-center whitespace-nowrap gap-1 px-3 py-2 rounded-lg transition-all duration-300 relative overflow-hidden ${activeDropdown === item.key
                      ? 'text-[#001730]'
                      : 'hover:bg-white/10 text-[#001730]'
                      }`}
                    style={{
                      fontSize: 'clamp(11px, 0.8vw, 14px)',
                      fontWeight: '500',
                      ...(activeDropdown === item.key && {
                        backdropFilter: 'blur(60px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(60px) saturate(180%)',
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                      }),
                    }}
                  >
                    <span>{item.label}</span>
                    {hasDropdown && (
                      <IoIosArrowDown
                        className={`w-3 h-3 transition-transform duration-300 ${activeDropdown === item.key ? 'rotate-180' : ''
                          }`}
                      />
                    )}
                  </button>

                  {hasDropdown && activeDropdown === item.key && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-6 min-w-[220px] z-[999]">
                      <div className="relative rounded-[8px] overflow-hidden border border-white/40 ">
                        {/* 🔥 APPLE-STYLE GLASS BACKGROUND */}
                        <div
                          className="absolute inset-0"
                          style={{
                            backdropFilter: 'blur(60px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(60px) saturate(180%)',
                            backgroundColor: 'rgba(225, 218, 218, 0.5)',
                          }}
                        />

                        {/* ✅ DROPDOWN CONTENT (TEXT UNCHANGED) */}
                        <div className="relative py-2">
                          {dropdowns[item.key].map((dropdownItem, index) => (
                            <button
                              key={index}
                              onClick={() => handleDropdownItemClick(dropdownItem)}
                              className="w-full text-left px-4 py-2 text-sm font-medium text-[#001730] hover:bg-white/50 transition-all duration-200"
                            >
                              {dropdownItem.label}
                            </button>
                          ))}
                        </div>
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

      {/* Backdrop Overlay - Smooth fade in/out */}
      {(mobileMenuOpen || isClosing) && (
        <div
          className={`fixed inset-0 bg-black/50 z-[45] ${isClosing ? 'opacity-0' : 'opacity-100'}`}
          onClick={closeMobileMenu}
          style={{
            pointerEvents: isClosing ? 'none' : 'auto',
            transition: 'opacity 0.6s cubic-bezier(0.22,1,0.36,1)',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Mobile Menu - Enhanced glassmorphism effect with closing animation */}
      {(mobileMenuOpen || isClosing) && (
        <div
          className={`fixed top-0 h-screen w-[80%] max-w-[400px] z-50 
            transform transition-all duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)]
          ${language === 'ar'
              ? 'left-0'
              : 'right-0'
            }
          ${language === 'ar'
              ? (isClosing ? '-translate-x-full opacity-0 scale-95 translate-y-3' : 'translate-x-0 opacity-100 scale-100 translate-y-0')
              : (isClosing ? 'translate-x-full opacity-0 scale-95 translate-y-3' : 'translate-x-0 opacity-100 scale-100 translate-y-0')
            }`}
          style={{
            background: 'rgb(12 12 32 / 87%)',
            borderRadius: language === 'ar' ? '0 5px 0 0' : '5px 0 0 0',
            boxShadow: isClosing
              ? '0 4px 30px rgba(0, 0, 0, 0.05)'
              : '0 20px 60px rgba(0,0,0,0.25)',
            backdropFilter: 'blur(22px) saturate(140%)',
            WebkitBackdropFilter: 'blur(22px) saturate(140%)',
            border: '1px solid rgba(107, 107, 107, 0.96)',
            pointerEvents: isClosing ? 'none' : 'auto',
            transition: 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), scale 0.85s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.85s cubic-bezier(0.16, 1, 0.3, 1), rotate 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
            transformOrigin: language === 'ar' ? 'left center' : 'right center',
            top: 0,
            right: language === 'ar' ? 'auto' : 0,
            left: language === 'ar' ? 0 : 'auto',
          }}
        >
          <div className="relative h-full flex flex-col text-white items-center justify-center" style={{ padding: '24px' }}>
            {/* Close Icon - Mobile */}
            <button
              onClick={closeMobileMenu}
              className={`absolute top-6 md:hidden p-2 rounded-md hover:bg-white/20 transition-all duration-300 z-10 ${language === 'ar' ? 'right-6' : 'left-6'
                }`}
              aria-label="Close menu"
            >
              <IoClose className="h-6 w-6 text-white" />
            </button>

            {/* Menu Content - Scrollable with smooth fade in - Centered */}
            <div
              className={`flex-1 overflow-y-auto overflow-x-hidden flex items-center justify-center ${isClosing ? 'opacity-0' : 'opacity-100'}`}
              style={{
                transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transitionDelay: isClosing ? '0ms' : '0.2s',
                paddingRight: '0',
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(255, 255, 255, 0.3) transparent',
              }}
            >
              {/* Navigation Menu Items with Dropdowns - Stagger Animation - Centered */}
              <div className="flex flex-col gap-3 items-center w-full">
                {menuItems.map((item, index) => {
                  const hasDropdown = dropdowns[item.key] && dropdowns[item.key].length > 0
                  const isMobileDropdownOpen = mobileActiveDropdown === item.key
                  const staggerDelay = isClosing ? 0 : index * 0.06 // 60ms delay between items for more natural reveal

                  return (
                    <div 
                      key={item.key} 
                      className="flex flex-col gap-2 w-full items-center"
                      style={{
                        opacity: isClosing ? 0 : 1,
                        transform: isClosing ? 'translateY(10px)' : 'translateY(0)',
                        transition: isClosing 
                          ? `opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1) ${(menuItems.length - index - 1) * 0.03}s, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) ${(menuItems.length - index - 1) * 0.03}s`
                          : 'none',
                        animation: !isClosing && mobileMenuOpen 
                          ? `slideUpFadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${staggerDelay}s both`
                          : 'none',
                      }}
                    >
                      <button
                        onClick={() => {
                          if (hasDropdown) {
                            toggleMobileDropdown(item.key)
                          } else {
                            handleMobileMenuItemClick(item)
                          }
                        }}
                        className="w-full max-w-[280px] py-3 px-4 rounded-lg text-center font-normal text-white transition-all duration-300
                                 bg-[rgba(160, 166, 176, 0.4)] hover:bg-[rgba(160, 166, 176, 0.5)] 
                                 border border-white/20 flex items-center justify-between shadow-sm"
                        style={{ fontSize: '15px' }}
                      >
                        <span className="flex-1 text-center">{item.label}</span>
                        {hasDropdown && (
                          <IoIosArrowDown
                            className={`w-4 h-4 text-white transition-transform duration-300 ${isMobileDropdownOpen ? 'rotate-180' : ''}`}
                          />
                        )}
                      </button>

                      {/* Mobile Dropdown Items */}
                      {hasDropdown && isMobileDropdownOpen && (
                        <div className="w-full max-w-[280px] flex flex-col gap-2">
                          {dropdowns[item.key].map((dropdownItem, index) => (
                            <button
                              key={index}
                              onClick={() => handleMobileDropdownItemClick(dropdownItem)}
                              className="w-full py-2 px-4 rounded-lg text-center font-normal text-white transition-all duration-300
                                       border border-white/10 flex items-center justify-between shadow-sm"
                              style={{ 
                                fontSize: '14px',
                                backgroundColor: 'rgb(42 44 57 / 87%)',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgb(42 44 57 / 95%)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgb(42 44 57 / 87%)';
                              }}
                            >
                              <span className="flex-1 text-center">{dropdownItem.label}</span>
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
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}

                {/* Language Selector as Menu Item */}
                <div 
                  className="flex flex-col gap-2 w-full items-center"
                  style={{
                    opacity: isClosing ? 0 : 1,
                    transform: isClosing ? 'translateY(10px)' : 'translateY(0)',
                    transition: isClosing 
                      ? `opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1) ${(menuItems.length) * 0.03}s, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) ${(menuItems.length) * 0.03}s`
                      : 'none',
                    animation: !isClosing && mobileMenuOpen 
                      ? `slideUpFadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${menuItems.length * 0.06}s both`
                      : 'none',
                  }}
                >
                  <button
                    onClick={() => {
                      const isLanguageOpen = mobileActiveDropdown === 'LANGUAGE'
                      toggleMobileDropdown(isLanguageOpen ? null : 'LANGUAGE')
                    }}
                    className="w-full max-w-[280px] py-3 px-4 rounded-lg text-center font-normal text-white transition-all duration-300
                             bg-[rgba(160, 166, 176, 0.4)] hover:bg-[rgba(160, 166, 176, 0.5)] 
                             border border-white/20 flex items-center justify-between shadow-sm"
                    style={{ fontSize: '15px' }}
                  >
                    <span className="flex-1 text-center">LANGUAGE</span>
                    <IoIosArrowDown
                      className={`w-4 h-4 text-white transition-transform duration-300 ${mobileActiveDropdown === 'LANGUAGE' ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Language Options Dropdown */}
                  {mobileActiveDropdown === 'LANGUAGE' && (
                    <div className="w-full max-w-[280px] flex flex-col gap-2">
                      <button
                        onClick={() => {
                          switchLanguage('en')
                          toggleMobileDropdown(null)
                        }}
                        disabled={isTranslating}
                        className={`w-full py-2.5 px-4 rounded-lg text-center font-normal text-white transition-all duration-300
                                 border flex items-center justify-center gap-2 shadow-sm ${
                                  language === 'en'
                                    ? 'bg-[rgba(160, 166, 176, 0.5)] border-white/40'
                                    : 'bg-[rgb(42,44,57/87%)] border-white/10 hover:bg-[rgb(42,44,57/95%)]'
                                } ${isTranslating ? 'opacity-50 cursor-not-allowed' : ''}`}
                        style={{ fontSize: '14px' }}
                      >
                        <span>English</span>
                        {language === 'en' && (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          switchLanguage('ar')
                          toggleMobileDropdown(null)
                        }}
                        disabled={isTranslating}
                        className={`w-full py-2.5 px-4 rounded-lg text-center font-normal text-white transition-all duration-300
                                 border flex items-center justify-center gap-2 shadow-sm ${
                                  language === 'ar'
                                    ? 'bg-[rgba(160, 166, 176, 0.5)] border-white/40'
                                    : 'bg-[rgb(42,44,57/87%)] border-white/10 hover:bg-[rgb(42,44,57/95%)]'
                                } ${isTranslating ? 'opacity-50 cursor-not-allowed' : ''}`}
                        style={{ fontSize: '14px' }}
                      >
                        <span>Arabic</span>
                        {language === 'ar' && (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>

                      {isTranslating && (
                        <div className="flex items-center justify-center py-2">
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