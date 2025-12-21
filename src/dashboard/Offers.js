'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const Offers = () => {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true)
        setError('')
        
        const response = await fetch('https://albackend.x-360.ai/api/offers')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch offers')
        }

        if (data.success && data.data) {
          setOffers(data.data)
        } else {
          setOffers([])
        }
      } catch (err) {
        console.error('Error fetching offers:', err)
        setError('Failed to load offers')
        setOffers([])
      } finally {
        setLoading(false)
      }
    }

    fetchOffers()
  }, [])

  if (loading) {
    return (
      <div className="mb-6 bg-white p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Offers</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">Loading offers...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mb-6 bg-white p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Offers</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    )
  }

  if (offers.length === 0) {
    return (
      <div className="mb-6 bg-white p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Offers</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">No offers available at the moment.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-6 bg-white p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Offers</h2>
        <div className="flex space-x-1">
          <button className="p-1 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      <div style={{fontSize: '10px'}} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {offers.map((offer) => (
          <div key={offer._id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="h-52 bg-gray-200 relative">
              {offer.imageurl ? (
                <Image 
                  src={offer.imageurl} 
                  alt={offer.title || 'Offer Image'} 
                  fill
                  style={{objectFit: 'cover'}}
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
                  style={{objectFit: 'cover'}}
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2">
                <h1 className="mb-3 font-semibold">
                  {offer.title || 'No Title'}
                </h1>
                <div className="border-t mb-2 border-gray-200"></div>
                <p className="text-xs">
                  {offer.description || 'No description available.'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Offers