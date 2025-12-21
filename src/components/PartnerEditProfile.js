'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://albackend.x-360.ai'

export default function PartnerEditProfile() {
  const { partner, fetchUserData } = useAuth()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [formData, setFormData] = useState({
    firstName: '',
    businessName: '',
    email: '',
    phone: '',
    phoneNumber: '',
    website: '',
    natureOfBusiness: '',
    address: '',
    profilePicture: '',
    bio: '',
    linkedin: '',
    instagram: '',
    snapchat: '',
    others: '',
    name: '',
    description: '',
    logo: ''
  })

  // Fetch partner data on component mount
  useEffect(() => {
    const fetchPartnerData = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        
        if (!token) {
          setMessage({ type: 'error', text: 'Please login to continue' })
          setLoading(false)
          return
        }

        const response = await fetch(`${API_URL}/api/partners/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch partner data')
        }

        const result = await response.json()
        
        if (result.success && result.data) {
          const partnerData = result.data
          // Pre-populate form with existing partner data
          setFormData({
            firstName: partnerData.firstName || '',
            businessName: partnerData.businessName || '',
            email: partnerData.email || '',
            phone: partnerData.phone || '',
            phoneNumber: partnerData.phoneNumber || '',
            website: partnerData.website || '',
            natureOfBusiness: partnerData.natureOfBusiness || '',
            address: partnerData.address || '',
            profilePicture: partnerData.profilePicture || '',
            bio: partnerData.bio || '',
            linkedin: partnerData.linkedin || '',
            instagram: partnerData.instagram || '',
            snapchat: partnerData.snapchat || '',
            others: partnerData.others || '',
            name: partnerData.name || '',
            description: partnerData.description || '',
            logo: partnerData.logo || ''
          })
        }
      } catch (error) {
        console.error('Error fetching partner data:', error)
        setMessage({ type: 'error', text: 'Failed to load partner data' })
      } finally {
        setLoading(false)
      }
    }

    fetchPartnerData()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    // Clear message when user starts typing
    if (message.text) {
      setMessage({ type: '', text: '' })
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // For now, store the file name. In production, you'd upload to a server first
      setFormData({
        ...formData,
        profilePicture: file.name
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setSubmitting(true)
      setMessage({ type: '', text: '' })
      
      const token = localStorage.getItem('token')
      if (!token) {
        setMessage({ type: 'error', text: 'Please login to continue' })
        return
      }

      const response = await fetch(`${API_URL}/api/partners/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update profile')
      }

      if (result.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
        
        // Update partner data in AuthContext
        if (result.data) {
          localStorage.setItem('partnerData', JSON.stringify(result.data))
          // Refresh partner data in context
          await fetchUserData(token)
        }
        
        // Clear message after 3 seconds
        setTimeout(() => {
          setMessage({ type: '', text: '' })
        }, 3000)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage({ type: 'error', text: error.message || 'Failed to update profile. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-3 md:p-4 lg:p-5">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-[5px] p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#001730]"></div>
              <span className="ml-3 text-gray-600">Loading profile data...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 md:p-4 lg:p-5">
      <div className="max-w-7xl mx-auto">
        {/* Main Form Container */}
        <div className=" rounded-[5px] overflow-hidden  bg-white  ">
          <div className="p-4 md:p-5 lg:p-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-4 border-b-2 ">
              <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-0">
                Edit Your Profile:
              </h2>
              <button className="bg-green-600 text-white px-4 py-1.5 rounded-md text-xs font-medium hover:bg-green-700 transition-colors self-start md:self-auto">
                Approved
              </button>
            </div>

            {/* Success/Error Message */}
            {message.text && (
              <div className={`mb-4 p-3 rounded-md ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                <div className="flex items-center">
                  {message.type === 'success' ? (
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="text-sm font-medium">{message.text}</span>
                </div>
              </div>
            )}

            {/* Form Fields */}
            <form onSubmit={handleSubmit}>
              {/* First Row - 4 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {/* First Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter here..."
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Business Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Business Name
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="Enter here..."
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter here..."
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber || formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter here..."
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Second Row - 4 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-4">
                {/* Website */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="Enter here..."
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Nature of business */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Nature of business
                  </label>
                  <input
                    type="text"
                    name="natureOfBusiness"
                    value={formData.natureOfBusiness}
                    onChange={handleInputChange}
                    placeholder="Enter here..."
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter here..."
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Upload Profile Picture */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Upload Profile Picture
                  </label>
                  <input
                    type="file"
                    name="profilePicture"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-2 file:py-0.5 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {formData.profilePicture && (
                    <p className="text-xs text-gray-500 mt-1">
                      Current: {formData.profilePicture}
                    </p>
                  )}
                </div>
              </div>

              {/* Third Row - Full Width Text Area */}
              <div className="mt-4">
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Write a short bio about yourself
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Enter here..."
                  rows={3}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Fourth Row - Social Media (4 columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-4">
                {/* LinkedIn */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Social Media - LinkedIn
                  </label>
                  <input
                    type="text"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    placeholder="Enter here..."
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Instagram */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Social Media - Instagram
                  </label>
                  <input
                    type="text"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    placeholder="Enter here..."
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Snapchat */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Social Media - Snapchat
                  </label>
                  <input
                    type="text"
                    name="snapchat"
                    value={formData.snapchat}
                    onChange={handleInputChange}
                    placeholder="Enter here..."
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Others */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Social Media - Others
                  </label>
                  <input
                    type="text"
                    name="others"
                    value={formData.others}
                    onChange={handleInputChange}
                    placeholder="Enter here..."
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  style={{borderRadius: "5px"}}
                  className={`bg-[#001730] text-white px-6 py-2 rounded-md text-xs font-medium transition-colors ${
                    submitting 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-[#17395e]'
                  }`}
                >
                  {submitting ? 'Updating...' : 'Submit For Approval'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
