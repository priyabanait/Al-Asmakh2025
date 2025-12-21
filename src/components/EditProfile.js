'use client'

import { useState, useEffect } from 'react'

export default function EditProfile() {
  const [formData, setFormData] = useState({
    firstName: '',
    secondName: '',
    email: '',
    phone: '',
    nationality: '',
    profession: '',
    locationCode: '',
    leaseNumber: '',
    profilePicture: '',
    bio: '',
    status: 'ACTIVE',
    linkedin: '',
    instagram: '',
    snapchat: '',
    youtube: '',
    thread: '',
    facebook: '',
    tiktok: ''
  })

  const [familyMembers, setFamilyMembers] = useState([])
  const [activeMemberIndex, setActiveMemberIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // Load user data and family members
  useEffect(() => {
    loadUserData()
    loadFamilyMembers()
  }, [])

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setMessage({ type: 'error', text: 'Please login first' })
        return
      }

      const response = await fetch('https://albackend.x-360.ai/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to load user data')
      }

      const result = await response.json()
      const user = result.data

      setFormData({
        firstName: user.firstName || '',
        secondName: user.secondName || '',
        email: user.email || '',
        phone: user.phone || '',
        nationality: user.nationality || '',
        profession: user.profession || '',
        locationCode: user.locationCode || '',
        leaseNumber: user.leaseNumber || '',
        profilePicture: user.profilePicture || '',
        bio: user.bio || '',
        status: user.status || 'ACTIVE',
        linkedin: user.socialMedia?.linkedin || '',
        instagram: user.socialMedia?.instagram || '',
        snapchat: user.socialMedia?.snapchat || '',
        youtube: user.socialMedia?.youtube || '',
        thread: user.socialMedia?.thread || '',
        facebook: user.socialMedia?.facebook || '',
        tiktok: user.socialMedia?.tiktok || ''
      })
    } catch (error) {
      console.error('Error loading user data:', error)
      setMessage({ type: 'error', text: 'Failed to load user data' })
    } finally {
      setLoading(false)
    }
  }

  const loadFamilyMembers = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch('https://albackend.x-360.ai/api/users/family-members', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        if (result.data && result.data.length > 0) {
          // Map family members to handle backward compatibility (photo -> profilePicture)
          const mappedMembers = result.data.map(member => ({
            ...member,
            profilePicture: member.profilePicture || member.photo || ''
          }))
          setFamilyMembers(mappedMembers)
        } else {
          // Initialize with one empty member if none exist
          setFamilyMembers([{
            _id: null,
            firstName: '',
            secondName: '',
            email: '',
            phone: '',
            nationality: '',
            profession: '',
            locationCode: '',
            leaseNumber: '',
            profilePicture: '',
            bio: '',
            status: 'ACTIVE',
            socialMedia: {
              linkedin: '',
              instagram: '',
              snapchat: '',
              youtube: '',
              thread: '',
              facebook: '',
              tiktok: ''
            }
          }])
        }
      }
    } catch (error) {
      console.error('Error loading family members:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleFamilyMemberChange = (index, field, value) => {
    const updated = [...familyMembers]
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      updated[index] = {
        ...updated[index],
        [parent]: {
          ...updated[index][parent],
          [child]: value
        }
      }
    } else {
      updated[index] = {
        ...updated[index],
        [field]: value
      }
    }
    setFamilyMembers(updated)
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

  const handleFamilyMemberFileChange = (index, e) => {
    const file = e.target.files[0]
    if (file) {
      handleFamilyMemberChange(index, 'profilePicture', file.name)
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

      const response = await fetch('https://albackend.x-360.ai/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to update profile' })
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage({ type: 'error', text: 'Failed to update profile' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleFamilyMemberSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage({ type: '', text: '' })

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setMessage({ type: 'error', text: 'Please login first' })
        return
      }

      const activeMember = familyMembers[activeMemberIndex]
      if (!activeMember) return

      const memberData = {
        firstName: activeMember.firstName,
        secondName: activeMember.secondName,
        email: activeMember.email,
        phone: activeMember.phone,
        nationality: activeMember.nationality,
        profession: activeMember.profession || '',
        locationCode: activeMember.locationCode || '',
        leaseNumber: activeMember.leaseNumber || '',
        profilePicture: activeMember.profilePicture || activeMember.photo || '',
        bio: activeMember.bio,
        status: activeMember.status || 'ACTIVE',
        linkedin: activeMember.socialMedia?.linkedin || '',
        instagram: activeMember.socialMedia?.instagram || '',
        snapchat: activeMember.socialMedia?.snapchat || '',
        youtube: activeMember.socialMedia?.youtube || '',
        thread: activeMember.socialMedia?.thread || '',
        facebook: activeMember.socialMedia?.facebook || '',
        tiktok: activeMember.socialMedia?.tiktok || ''
      }

      let response
      if (activeMember._id) {
        // Update existing family member
        response = await fetch(`https://albackend.x-360.ai/api/users/family-members/${activeMember._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(memberData)
        })
      } else {
        // Create new family member
        response = await fetch('https://albackend.x-360.ai/api/users/family-members', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(memberData)
        })
      }

      const result = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: `Family member ${activeMember._id ? 'updated' : 'added'} successfully!` })
        await loadFamilyMembers() // Reload to get updated IDs
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to save family member' })
      }
    } catch (error) {
      console.error('Error saving family member:', error)
      setMessage({ type: 'error', text: 'Failed to save family member' })
    } finally {
      setSubmitting(false)
    }
  }

  const addFamilyMember = () => {
    // Check if already at max (5 family members)
    if (familyMembers.length >= 5) {
      setMessage({ type: 'error', text: 'Maximum of 5 family members allowed' })
      return
    }
    
    setFamilyMembers([
      ...familyMembers,
      {
        _id: null,
        firstName: '',
        secondName: '',
        email: '',
        phone: '',
        nationality: '',
        profession: '',
        locationCode: '',
        leaseNumber: '',
        profilePicture: '',
        bio: '',
        status: 'ACTIVE',
        socialMedia: {
          linkedin: '',
          instagram: '',
          snapchat: '',
          youtube: '',
          thread: '',
          facebook: '',
          tiktok: ''
        }
      }
    ])
    setActiveMemberIndex(familyMembers.length)
  }

  return (
    <div className="p-3 md:p-4 ">
      <div className="max-w-7xl  mx-auto space-y-6">
        
        {/* Edit Your Profile Section */}
        <div className="bg-white  shadow p-4 md:p-5" style={{borderRadius: '5px'}}>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-3">
            <h2 className="text-lg md:text-xl font-semibold text-[#2D3748]">Edit Your Profile</h2>
            <button className="mt-3 md:mt-0 bg-green-600 text-white px-4 py-1.5 rounded-[5px] text-xs font-medium hover:bg-green-700">
              Approved
            </button>
          </div>

          {/* Row 1: 4 equal columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            {/* First Name */}
            <div>
              <label className="block text-xs font-medium text-[#2D3748] mb-1.5">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter here..."
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Second Name */}
            <div>
              <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Second Name</label>
              <input
                type="text"
                name="secondName"
                value={formData.secondName}
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
            {/* Nationality */}
            <div>
              <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Nationality</label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
                placeholder="Enter here..."
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Profession */}
            <div>
              <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Profession</label>
              <input
                type="text"
                name="profession"
                value={formData.profession}
                onChange={handleInputChange}
                placeholder="Enter here..."
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 2.5: Location Code and Lease Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            {/* Location Code */}
            <div>
              <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Location Code</label>
              <input
                type="text"
                name="locationCode"
                value={formData.locationCode}
                onChange={handleInputChange}
                placeholder="Enter here..."
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Lease Number */}
            <div>
              <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Lease Number</label>
              <input
                type="text"
                name="leaseNumber"
                value={formData.leaseNumber}
                onChange={handleInputChange}
                placeholder="Enter here..."
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 3: Upload Profile Picture */}
          <div className="mb-3">
            {/* Upload Profile Picture */}
            <div>
              <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Upload Profile Picture</label>
              <input
                type="file"
                name="profilePicture"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 3: Full width Bio */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Write a short bio about yourself</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Enter here..."
              rows={3}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Row 4: 4 equal columns - Social Media */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Social Media - LinkedIn</label>
              <input
                type="text"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                placeholder="Enter here..."
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Social Media - Instagram</label>
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleInputChange}
                placeholder="Enter here..."
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Social Media - Snapchat</label>
              <input
                type="text"
                name="snapchat"
                value={formData.snapchat}
                onChange={handleInputChange}
                placeholder="Enter here..."
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Social Media - YouTube</label>
              <input
                type="text"
                name="youtube"
                value={formData.youtube}
                onChange={handleInputChange}
                placeholder="Enter here..."
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 5: Additional Social Media */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Social Media - Thread</label>
              <input
                type="text"
                name="thread"
                value={formData.thread}
                onChange={handleInputChange}
                placeholder="Enter here..."
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Social Media - Facebook</label>
              <input
                type="text"
                name="facebook"
                value={formData.facebook}
                onChange={handleInputChange}
                placeholder="Enter here..."
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Social Media - TikTok</label>
              <input
                type="text"
                name="tiktok"
                value={formData.tiktok}
                onChange={handleInputChange}
                placeholder="Enter here..."
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Message */}
          {message.text && (
            <div className={`mt-3 p-2 rounded-[5px] text-xs ${
              message.type === 'success' 
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

        {/* Horizontal Line */}
        {/* <div className="border-t-2 border-blue-600"></div> */}

        {/* Edit / Add Family Members Section */}
        <div className="bg-white rounded-[5px] shadow p-4 md:p-5">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-3 border-b-2">
            <h2 className="text-lg md:text-xl font-semibold text-[#2D3748] mb-3 md:mb-0">Edit / Add Family Members in your ID:</h2>
            <div className="flex gap-2 flex-wrap">
              {familyMembers.map((member, index) => (
                <button
                  key={member._id || index}
                  onClick={() => setActiveMemberIndex(index)}
                  className={`px-3 py-1.5 rounded-[5px] text-xs font-medium ${
                    activeMemberIndex === index
                      ? 'bg-[#001730] text-white'
                      : 'bg-gray-200 text-[#2D3748]'
                  }`}
                >
                  Member {index + 1}
                </button>
              ))}
              <button className="bg-yellow-500 text-white px-3 py-1.5 rounded-[5px] text-xs font-medium hover:bg-yellow-600">
                Pending
              </button>
            </div>
          </div>

          {familyMembers.length > 0 && (
            <>
              {/* Row 1: 4 equal columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                {/* First Name */}
                <div>
                  <label className="block text-xs font-medium text-[#2D3748] mb-1.5">First Name</label>
                  <input
                    type="text"
                    value={familyMembers[activeMemberIndex]?.firstName || ''}
                    onChange={(e) => handleFamilyMemberChange(activeMemberIndex, 'firstName', e.target.value)}
                    placeholder="Enter here..."
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Second Name */}
                <div>
                  <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Second Name</label>
                  <input
                    type="text"
                    value={familyMembers[activeMemberIndex]?.secondName || ''}
                    onChange={(e) => handleFamilyMemberChange(activeMemberIndex, 'secondName', e.target.value)}
                    placeholder="Enter here..."
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Email</label>
                  <input
                    type="email"
                    value={familyMembers[activeMemberIndex]?.email || ''}
                    onChange={(e) => handleFamilyMemberChange(activeMemberIndex, 'email', e.target.value)}
                    placeholder="Enter here..."
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Nationality */}
                <div>
                  <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Nationality</label>
                  <input
                    type="text"
                    value={familyMembers[activeMemberIndex]?.nationality || ''}
                    onChange={(e) => handleFamilyMemberChange(activeMemberIndex, 'nationality', e.target.value)}
                    placeholder="Enter here..."
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Row 2: 2 equal columns */}
              <div className="grid grid-cols-2 md:grid-cols-2 gap-2 mb-3">
                {/* Photo */}
                <div>
                  <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Photo</label>
                  <input
                    type="file"
                    onChange={(e) => handleFamilyMemberFileChange(activeMemberIndex, e)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {/* Phone */}
                <div>
                  <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Phone</label>
                  <input
                    type="text"
                    value={familyMembers[activeMemberIndex]?.phone || ''}
                    onChange={(e) => handleFamilyMemberChange(activeMemberIndex, 'phone', e.target.value)}
                    placeholder="Enter here..."
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Row 2.5: Profession, Location Code, Lease Number */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                {/* Profession */}
                <div>
                  <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Profession</label>
                  <input
                    type="text"
                    value={familyMembers[activeMemberIndex]?.profession || ''}
                    onChange={(e) => handleFamilyMemberChange(activeMemberIndex, 'profession', e.target.value)}
                    placeholder="Enter here..."
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {/* Location Code */}
                <div>
                  <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Location Code</label>
                  <input
                    type="text"
                    value={familyMembers[activeMemberIndex]?.locationCode || ''}
                    onChange={(e) => handleFamilyMemberChange(activeMemberIndex, 'locationCode', e.target.value)}
                    placeholder="Enter here..."
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {/* Lease Number */}
                <div>
                  <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Lease Number</label>
                  <input
                    type="text"
                    value={familyMembers[activeMemberIndex]?.leaseNumber || ''}
                    onChange={(e) => handleFamilyMemberChange(activeMemberIndex, 'leaseNumber', e.target.value)}
                    placeholder="Enter here..."
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Row 3: Full width Bio */}
              <div className="mb-3">
                <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Write a short bio about yourself</label>
                <textarea
                  value={familyMembers[activeMemberIndex]?.bio || ''}
                  onChange={(e) => handleFamilyMemberChange(activeMemberIndex, 'bio', e.target.value)}
                  placeholder="Enter here..."
                  rows={3}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Row 4: 4 equal columns - Social Media */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Social Media - LinkedIn</label>
                  <input
                    type="text"
                    value={familyMembers[activeMemberIndex]?.socialMedia?.linkedin || ''}
                    onChange={(e) => handleFamilyMemberChange(activeMemberIndex, 'socialMedia.linkedin', e.target.value)}
                    placeholder="Enter here..."
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Social Media - Instagram</label>
                  <input
                    type="text"
                    value={familyMembers[activeMemberIndex]?.socialMedia?.instagram || ''}
                    onChange={(e) => handleFamilyMemberChange(activeMemberIndex, 'socialMedia.instagram', e.target.value)}
                    placeholder="Enter here..."
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Social Media - Snapchat</label>
                  <input
                    type="text"
                    value={familyMembers[activeMemberIndex]?.socialMedia?.snapchat || ''}
                    onChange={(e) => handleFamilyMemberChange(activeMemberIndex, 'socialMedia.snapchat', e.target.value)}
                    placeholder="Enter here..."
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Social Media - YouTube</label>
                  <input
                    type="text"
                    value={familyMembers[activeMemberIndex]?.socialMedia?.youtube || ''}
                    onChange={(e) => handleFamilyMemberChange(activeMemberIndex, 'socialMedia.youtube', e.target.value)}
                    placeholder="Enter here..."
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Row 5: Additional Social Media */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Social Media - Thread</label>
                  <input
                    type="text"
                    value={familyMembers[activeMemberIndex]?.socialMedia?.thread || ''}
                    onChange={(e) => handleFamilyMemberChange(activeMemberIndex, 'socialMedia.thread', e.target.value)}
                    placeholder="Enter here..."
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Social Media - Facebook</label>
                  <input
                    type="text"
                    value={familyMembers[activeMemberIndex]?.socialMedia?.facebook || ''}
                    onChange={(e) => handleFamilyMemberChange(activeMemberIndex, 'socialMedia.facebook', e.target.value)}
                    placeholder="Enter here..."
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#2D3748] mb-1.5">Social Media - TikTok</label>
                  <input
                    type="text"
                    value={familyMembers[activeMemberIndex]?.socialMedia?.tiktok || ''}
                    onChange={(e) => handleFamilyMemberChange(activeMemberIndex, 'socialMedia.tiktok', e.target.value)}
                    placeholder="Enter here..."
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </>
          )}

          {/* Message */}
          {message.text && (
            <div className={`mt-3 p-2 rounded-[5px] text-xs ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-700 border border-green-400' 
                : 'bg-red-100 text-red-700 border border-red-400'
            }`}>
              {message.text}
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-6 flex ">
            <button 
              onClick={handleFamilyMemberSubmit}
              disabled={submitting || loading}
              className="bg-[#001730] text-white px-6 py-2 rounded-[5px] text-xs font-medium hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit For Approval'}
            </button>
          </div>
        </div>

        {/* Add More Family Members Button */}
        <div className="flex justify-center">
          <button
            onClick={addFamilyMember}
            disabled={familyMembers.length >= 5}
            className={`px-6 py-2 rounded-[5px] text-xs font-medium ${
              familyMembers.length >= 5
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-[#001730] text-white hover:bg-blue-800'
            }`}
          >
            {familyMembers.length >= 5 ? 'Maximum 5 Family Members Reached' : 'Add More Family Members'}
          </button>
        </div>
      </div>
    </div>
  )
}

