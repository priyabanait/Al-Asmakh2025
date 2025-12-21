'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useAuth } from '../contexts/AuthContext'

const Members = () => {
  const { partner } = useAuth();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Fetch scanned members data
  useEffect(() => {
    const fetchScannedMembers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Authentication token not found');
          setLoading(false);
          return;
        }
        
        // Fetch partner-specific scans
        console.log('Fetching partner-specific scans...');
        const response = await fetch('https://albackend.x-360.ai/api/scans', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch scanned members');
        }
        
        console.log('Scans fetched successfully:', data);
        setScans(data.data);
        
        // If no scans are returned from the backend, we'll use the sample data
        // In a production environment, this would be removed
        if (data.data && data.data.length === 0) {
          console.log('No scans found, using sample data');
        }
      } catch (err) {
        console.error('Error fetching scanned members:', err);
        setError('Failed to load scanned members');
      } finally {
        setLoading(false);
      }
    };
    
    fetchScannedMembers();
  }, []);
  
  // Refresh scans periodically (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) return;
        
        const response = await fetch('https://albackend.x-360.ai/api/scans', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setScans(data.data);
          console.log('Scans refreshed');
        }
      } catch (err) {
        console.error('Error refreshing scans:', err);
      }
    }, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };
  
  // Process scan data to display in the members list
  const processScans = () => {
    if (scans && scans.length > 0) {
      console.log('Processing scans for display:', scans);
      return scans.map(scan => {
        // Handle user scans
        if (scan.scanType === 'user' && scan.user) {
          const firstName = scan.user?.firstName || 'Unknown';
          const secondName = scan.user?.secondName || 'User';
          const userId = scan.user?._id || scan.user || 'unknown';
          const profilePicture = scan.user?.profilePicture || '/images/person_icon.png';
          
          return {
            name: `${firstName} ${secondName}`,
            id: typeof userId === 'string' ? userId.substring(0, 8) : 'N/A',
            date: formatDate(scan.timestamp),
            amount: scan.amount || 0,
            image: profilePicture || '/images/person_icon.png',
            scanType: 'user'
          };
        }
        // Handle partner scans
        else if (scan.scanType === 'partner' && scan.scannedPartner) {
          const name = scan.scannedPartner?.name || scan.scannedPartner?.businessName || 'Unknown Partner';
          const partnershipId = scan.scannedPartner?.partnershipId || scan.scannedPartner?._id || 'unknown';
          const profilePicture = scan.scannedPartner?.profilePicture || scan.scannedPartner?.logo || '/images/person_icon.png';
          
          return {
            name: name,
            id: typeof partnershipId === 'string' ? partnershipId.substring(0, 8) : 'N/A',
            date: formatDate(scan.timestamp),
            amount: scan.amount || 0,
            image: profilePicture || '/images/person_icon.png',
            scanType: 'partner'
          };
        }
        // Fallback for old data format
        else {
          const firstName = scan.user?.firstName || 'Unknown';
          const secondName = scan.user?.secondName || 'User';
          const userId = scan.user?._id || scan.user || 'unknown';
          const profilePicture = scan.user?.profilePicture || '/images/person_icon.png';
          
          return {
            name: `${firstName} ${secondName}`,
            id: typeof userId === 'string' ? userId.substring(0, 8) : 'N/A',
            date: formatDate(scan.timestamp),
            amount: scan.amount || 0,
            image: profilePicture || '/images/person_icon.png',
            scanType: 'user'
          };
        }
      });
    }
    
    // Return empty array when no scans are available
    return [];
  };
  
  // Get members to display
  const members = processScans();

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 m-4 md:p-6 relative overflow-hidden">
      {/* Scrollable Container */}
      <div className="overflow-y-auto max-h-[600px]">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Members</h2>
        </div>

                {/* Column Headers */}
        <div className="flex items-center justify-between py-2 border-b border-gray-200 mb-2">
          <div className="flex-1">
            <span className="text-sm font-semibold text-[#A0AEC0]">Name</span>
          </div>
          <div className="flex-shrink-0 flex space-x-8 items-center">
            {/* <span className="text-sm font-semibold text-[#A0AEC0]">Amount</span> */}
            <span className="text-sm font-semibold text-[#A0AEC0] w-20 text-right">Date</span>
          </div>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded my-4">
            <p>{error}</p>
          </div>
        )}

        {/* Members List */}
        <div className="space-y-2">
          {members.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-sm">No scanned members yet</p>
              <p className="text-xs text-gray-400 mt-1">Scan QR codes to see members here</p>
            </div>
          ) : (
            members.map((member, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between py-1 border-b border-gray-200 last:border-b-0"
              >
                {/* Left - Profile and Name */}
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <div className="w-10 h-10 border border-gray-200 overflow-hidden bg-gray-200 flex-shrink-0" style={{borderRadius:"10px"}}>
                    {member.image && member.image !== '/images/person_icon.png' ? (
                      <Image 
                        src={member.image} 
                        alt={member.name} 
                        width={40} 
                        height={40}
                        className="w-full h-full object-cover"
                        style={{borderRadius:"10px"}}
                        onError={(e) => {
                          e.target.src = '/images/person_icon.png';
                        }}
                      />
                    ) : (
                      <Image 
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKgAAACUCAMAAAAwLZJQAAAAMFBMVEXk5ueutLfn6eqrsbTh4+SorrLR1Na9wsSxt7q1ur3d4OHa3d64vcDIzM7M0NLU19g5zzA6AAAEfklEQVR4nO2cwbKrIAxAJYCAiP7/3z5Ap621tgoJcOd5NndxN2ciCYhJu+7m5ubm5uamEQBqG3zH+wlr58kFptla0aQydLNTRnMpecD/YaNyc9eYKlilGedsC+daK9tOWGGYtHyXfCD1NDShCsLpQ8slsMaJ+qow/dCMqmyqbArWyJ+acQEYW1MVHPsdzjWofKqWVSDGs5pRVYlKnvbE6twGtUr6w3z6sT9M2VzBs7+qGVXn0jGF/ly2vyMLm4JNiWekqKnPo1RPxkpmlDDJAfW5X84TLtXPnakq5jmlJdLDtNTGb7M0A4X2fZXz4GNIxxKiMOc9+IDsC5hCbjwDeqD3dBiiBfJpMAiePqTURz6YMALqVyl1SMWI4ukhFkVI+QVOm/iAFlBGXEuxAurTyRJqYqVSgE+UogrNk/YQNWScl/fQlVL/4omIJHwlRVyi/tk7urzPPuBtMGSieNtShNOJogaUcbJssnjlPoqSlXy0jX4VpdruMfelCFXa4xzuX1BUorjV6Ra9Rf9j0T+T9diiZHUUueDTXZf8lS20G5AjSnZTJlBfmZikO+Fn3d3voRPFTXuq6oSd9ryn8vSvy5iLlC6XkN/uDOFdLuqVjqPzTPz2fQDpBSnKJ5EFyiePei6hK04RtFd7Sf2lCevwTP2VEevmkfLOcQXlgxgfyXugAGeVFugsyWt/WBnJNT3pDToPyFM+kn+GorwU35CZT7zIg+9Cq3BmPhVrJc07mxB/rt2SsT9J4k3+jeQaVWyBrsDFJtenZ+m23CEpplyXb3RPaSTkpkbz8PW9lKtKgwPuWj2VqtqIy6X+YcILh5/A+ZTipvK8SL8bDvqoyabak00w/N6leLWhhg1e9Wv151q1MdAUXk8mczB5xeXoqs7dvAHd4PSnUTZH2YaVBoDolRqNDleTWptRqV60M2+3IQxcDtbO82zt4CXbtFyAJ7VV9ixWg49lCGYfiVH1YRVdI87eQth+cnF1hvR54leqMUqFqVtR2RY6Oymz5PdRJV3/Mbq5q7E3hTjOzsjjudV9QZVa9bbo3G0sRCM7L/mU5Ua5Uq4gppFdHrd7yvqlS78LAAy94tnXeVwGV7q4Asxqv08mujI1kR1Q+4wn/kmVk5yqBsdw2wpYPFoh/1JAmPNH7idZVfmIOdJ84hCf4WqQogrCISXQEXLEOFrDlDFaeRJfAnLT6vLEd6oqz3pLDU+9hGZAmvQvOmCRm12+wlnyB/xy4VxVTcpXHRhG9AL/0zRhIgfmMln0rnr1gj93PDnd9GJjROnl+WKqL1R/9Nbba5w3pd+LvnOyol77mRQSTnXAQu14spO/EtKAJzvz9Ovm0YNfuV85359w9t2zVp3/gP4mitAugsa3AVeBM+SPxHEDQjMLdEUebPupPzhEx+ceBMAdTMbgYEajsQcf+XTtNzfo+eknYlKbRGiRuw2qvUxa2A9iN1VCX3grptDXFjrgfX8SLaZ85G0Su6VNfsv2BRp97A+RzXgWtJnykdftCeNHseh4KfqtHZu2LL+29Q+mxD9yHdOgqgAAAABJRU5ErkJggg==" 
                        alt={member.name} 
                        width={40} 
                        height={40}
                        className="w-full h-full object-cover"
                        style={{borderRadius:"10px"}}
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm md:text-sm font-bold text-[#2D3748]">
                      {member.name}
                    </p>

                    <span className="text-xs text-[#718096]">
                     ID {member.id}
                    </span>
                  </div>
                </div>

                {/* Right - Amount, Date and View */}
                <div className="flex items-center space-x-8 flex-shrink-0">
                  {/* <p className="text-xs md:text-sm text-[#2D3748] w-16 text-right">
                    {member.amount ? `${member.amount} QAR` : 'N/A'}
                  </p> */}
                  <p className="text-xs md:text-sm text-[#2D3748] w-20 text-right">
                    {member.date}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Members


