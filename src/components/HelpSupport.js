'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function HelpSupport() {
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    phone: '',
    category: '',
    subject: '',
    message: ''
  })

  const [previousTickets] = useState([
    {
      id: 1,
      name: 'Fathima Junaid',
      email: 'fathimajunaid@gmail.com',
      avatar: '/images/placeholder.svg',
      type: 'Partner Inquiry',
      status: 'Open',
      createdAt: '24/05/24'
    },
    {
      id: 2,
      name: 'Ahmad Hassan',
      email: 'ahmad.hassan@example.com',
      avatar: '/images/placeholder.svg',
      type: 'IT Support',
      status: 'Closed',
      createdAt: '22/05/24'
    },
    {
      id: 3,
      name: 'Sarah Ali',
      email: 'sarah.ali@example.com',
      avatar: '/images/placeholder.svg',
      type: 'Developer',
      status: 'Open',
      createdAt: '20/05/24'
    },
    {
      id: 4,
      name: 'Mohammed Khan',
      email: 'm.khan@example.com',
      avatar: '/images/placeholder.svg',
      type: 'General Inquiry',
      status: 'Closed',
      createdAt: '18/05/24'
    },
    {
      id: 5,
      name: 'Layla Ibrahim',
      email: 'layla.ibrahim@example.com',
      avatar: '/images/placeholder.svg',
      type: 'Account Issue',
      status: 'Open',
      createdAt: '15/05/24'
    },
    {
      id: 6,
      name: 'Omar Al-Mansoori',
      email: 'omar.mansoori@example.com',
      avatar: '/images/placeholder.svg',
      type: 'Billing Question',
      status: 'Closed',
      createdAt: '12/05/24'
    },
    {
      id: 7,
      name: 'Aisha Mohammed',
      email: 'aisha.m@example.com',
      avatar: '/images/placeholder.svg',
      type: 'Technical Support',
      status: 'Open',
      createdAt: '10/05/24'
    }
  ])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Ticket submitted:', formData)
    // Handle form submission here
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* We are Here to Help Section */}
        <div className="bg-white rounded-lg shadow p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">We are Here to Help</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name and Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter Your First Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter Your Email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Phone and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter Your Phone"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="Select Category"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Subject - Full Width */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Enter Subject"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Message - Full Width */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Enter Your Message"
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="bg-blue-900 text-white px-8 py-3 rounded-md text-sm font-medium hover:bg-blue-800 transition-colors"
              >
                Submit Your Ticket
              </button>
            </div>
          </form>
        </div>

        {/* Previous Tickets Section */}
        <div className="bg-white rounded-lg shadow p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Previous Tickets</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Name</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Type</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Created At</th>
                </tr>
              </thead>
              <tbody>
                {previousTickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                          <Image 
                            src={ticket.avatar} 
                            alt={ticket.name}
                            width={40}
                            height={40}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{ticket.name}</p>
                          <p className="text-xs text-gray-500">{ticket.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">{ticket.type}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        ticket.status === 'Open' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">{ticket.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

