'use client'

import { useState, useEffect } from 'react'

export default function PartnerEditProfile() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    businessType: '',
    address: '',
    description: '',
    website: '',
    profilePicture: ''
  })

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // Load partner data
  useEffect(() => {
    loadPartnerData()
  }, [])

  const loadPartnerData = async () => {
    try {
      const token = localStorage.getItem('token')
      const partnerData = localStorage.getItem('partnerData')
      
      if (!token) {
        setMessage({ type: 'error', text: 'Please login first' })
        return
      }

      // Try to get partner data from localStorage first
      if (partnerData) {
        try {
          const parsed = JSON.parse(partnerData)
          setFormData({
            name: parsed.name || parsed.businessName || '',
            email: parsed.email || '',
            phone: parsed.phone || parsed.mobile || '',
            businessName: parsed.businessName || parsed.name || '',
            businessType: parsed.businessType || parsed.category || '',
            address: parsed.address || '',
            description: parsed.description || parsed.bio || '',
            website: parsed.website || '',
            profilePicture: parsed.profilePicture || parsed.logo || ''
          })
        } catch (e) {
          console.error('Error parsing partner data:', e)
        }
      }

      // Try to fetch from API if available
      try {
        const response = await fetch('http://localhost:3002/api/partners/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const result = await response.json()
          const partner = result.data || result
          setFormData({
            name: partner.name || partner.businessName || '',
            email: partner.email || '',
            phone: partner.phone || partner.mobile || '',
            businessName: partner.businessName || partner.name || '',
            businessType: partner.businessType || partner.category || '',
            address: partner.address || '',
            description: partner.description || partner.bio || '',
            website: partner.website || '',
            profilePicture: partner.profilePicture || partner.logo || ''
          })
        }
      } catch (error) {
        console.error('Error fetching partner data:', error)
        // Continue with localStorage data if API fails
      }
    } catch (error) {
      console.error('Error loading partner data:', error)
      setMessage({ type: 'error', text: 'Failed to load partner data' })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // For now, just store filename. In production, you'd upload to server
      setFormData({
        ...formData,
        profilePicture: file.name
      })
    }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage({ type: '', text: '' })

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setMessage({ type: 'error', text: 'Please login first' })
        return
      }

      // Try to update via API
      const response = await fetch('http://localhost:3002/api/partners/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (response.ok) {
        // Update localStorage
        const partnerData = localStorage.getItem('partnerData')
        if (partnerData) {
          const parsed = JSON.parse(partnerData)
          const updated = { ...parsed, ...formData }
          localStorage.setItem('partnerData', JSON.stringify(updated))
        }
        
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to update profile' })
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      // Even if API fails, update localStorage
      const partnerData = localStorage.getItem('partnerData')
      if (partnerData) {
        const parsed = JSON.parse(partnerData)
        const updated = { ...parsed, ...formData }
        localStorage.setItem('partnerData', JSON.stringify(updated))
        setMessage({ type: 'success', text: 'Profile updated locally!' })
      } else {
        setMessage({ type: 'error', text: 'Failed to update profile' })
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-3 md:p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow p-4 md:p-5 rounded-[5px]">
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#001730] mb-2"></div>
              <p className="text-gray-600 text-sm">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 md:p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Edit Partner Profile Section */}
        <div className="bg-white shadow p-4 md:p-5" style={{ borderRadius: '5px' }}>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-3">
            <h2 className="text-lg md:text-xl font-semibold text-[#2D3748]">Edit Partner Profile</h2>
            <button className="mt-3 md:mt-0 bg-green-600 text-white px-4 py-1.5 rounded-[5px] text-xs font-medium hover:bg-green-700">
              Approved
            </button>
          </div>

          {/* Row 1: 4 equal columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            {/* Business Name */}
            <div>
              <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Business Name</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                placeholder="Enter here..."
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Contact Name */}
            <div>
              <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Contact Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter here..."
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter here..."
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter here..."
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 2: 2 equal columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            {/* Business Type */}
            <div>
              <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Business Type</label>
              <input
                type="text"
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                placeholder="Enter here..."
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://..."
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 3: Address */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter here..."
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Row 4: Upload Profile Picture */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Upload Logo/Profile Picture</label>
            <input
              type="file"
              name="profilePicture"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Row 5: Description */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Business Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter here..."
              rows={4}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Message */}
          {message.text && (
            <div className={`mt-3 p-2 rounded-[5px] text-xs ${message.type === 'success'
              ? 'bg-green-100 text-green-700 border border-green-400'
              : 'bg-red-100 text-red-700 border border-red-400'
              }`}>
              {message.text}
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-6 flex">
            <button
              onClick={handleProfileSubmit}
              disabled={submitting}
              className="bg-[#001730] text-white px-6 py-2 rounded-[5px] text-xs font-medium hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit For Approval'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
