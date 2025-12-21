"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';

export default function UserScanClient({ params: serverParams }) {
  const router = useRouter();
  const clientParams = useParams();
  const { partner, loading: authLoading, isAuthenticated, isPartner } = useAuth();
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [userData, setUserData] = useState(null);
  const [scanData, setScanData] = useState(null);

  useEffect(() => {
    const processScan = async () => {
      // Wait for auth to load
      if (authLoading) return;

      // Check if user is authenticated and is a partner
      if (!isAuthenticated() || !isPartner()) {
        router.push('/partner-login');
        return;
      }

      // Extract user ID from URL pathname for static export compatibility
      // Catch-all route: params.id will be an array, e.g., ['1233'] for /user/1233
      let userId = null;
      
      if (typeof window !== 'undefined') {
        const pathname = window.location.pathname;
        const match = pathname.match(/\/user\/([^\/]+)/);
        if (match && match[1]) {
          userId = match[1];
        }
      }
      
      // Fallback to params if pathname extraction didn't work
      // For catch-all route, params.id is an array
      if (!userId) {
        const idParam = serverParams?.id || clientParams?.id;
        // Handle array (catch-all) or string (single param)
        if (Array.isArray(idParam)) {
          userId = idParam[0]; // Take first element for /user/1233
        } else if (idParam) {
          userId = idParam;
        }
      }

      if (!userId) {
        setError('Invalid user ID');
        setProcessing(false);
        return;
      }

      try {
        // Get partner token
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found. Please log in again.');
          setProcessing(false);
          router.push('/partner-login');
          return;
        }

        // Step 1: Fetch user data from API
        console.log("Fetching user data for ID:", userId);
        const userResponse = await fetch(`https://albackend.x-360.ai/api/users/${userId}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!userResponse.ok) {
          const errorData = await userResponse.json();
          throw new Error(errorData.message || "Failed to fetch user data");
        }

        const userResult = await userResponse.json();
        const user = userResult.data;
        console.log("User data fetched:", user);
        
        // Set user data to display
        setUserData(user);

        // Step 2: Record the scan in the backend
        const scanDataPayload = {
          userId: userId,
          amount: 0,
          location: "Mobile App",
          notes: "Scanned via QR code"
        };

        console.log("Recording user scan with data:", scanDataPayload);

        const scanResponse = await fetch("https://albackend.x-360.ai/api/scans", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(scanDataPayload)
        });

        if (!scanResponse.ok) {
          const errorData = await scanResponse.json();
          throw new Error(errorData.message || "Failed to record scan");
        }

        const scanResult = await scanResponse.json();
        console.log("Scan recorded successfully:", scanResult);
        
        // Set scan data
        setScanData(scanResult.data);
        setSuccess(true);
        setProcessing(false);

        // Navigate to success page with scan ID after showing user data
        if (scanResult.data && scanResult.data._id) {
          setTimeout(() => {
            router.push(`/scanned/success/${scanResult.data._id}`);
          }, 3000); // Show user data for 3 seconds before navigating
        } else {
          // Fallback: navigate to dashboard if no scan ID
          setTimeout(() => {
            router.push('/partner-dashboard');
          }, 3000);
        }

      } catch (error) {
        console.error("Error processing scan:", error);
        setError(error.message || "Could not process scan. Please try again.");
        setProcessing(false);
        
        // Navigate to partner-dashboard after showing error for 3 seconds
        setTimeout(() => {
          router.push('/partner-dashboard');
        }, 3000);
      }
    };

    processScan();
  }, [serverParams?.id, clientParams?.id, router, authLoading, isAuthenticated, isPartner]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        {processing && !error && !success && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">Processing scan...</p>
            <p className="text-gray-500 text-sm mt-2">Fetching user data and recording scan</p>
          </div>
        )}

        {success && userData && (
          <div className="text-center">
            {/* Success Icon */}
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            {/* Success Message */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Scan Successful!</h2>
            
            {/* User Data Display */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Scanned User Information</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Name:</span>
                  <span className="text-gray-900">{userData.firstName} {userData.secondName}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Email:</span>
                  <span className="text-gray-900 break-all">{userData.email}</span>
                </div>
                
                {userData.phone && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Phone:</span>
                    <span className="text-gray-900">{userData.phone}</span>
                  </div>
                )}
                
                {userData.customerId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Customer ID:</span>
                    <span className="text-gray-900 font-mono text-sm">{userData.customerId}</span>
                  </div>
                )}
                
                {userData.tenantId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Tenant ID:</span>
                    <span className="text-gray-900 font-mono text-sm">{userData.tenantId}</span>
                  </div>
                )}
                
                {userData.nationality && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Nationality:</span>
                    <span className="text-gray-900">{userData.nationality}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Scan Info */}
            {scanData && (
              <div className="bg-blue-50 rounded-lg p-3 mb-4 text-left">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Scan ID:</span> <span className="font-mono text-xs">{scanData._id}</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Timestamp:</span> {new Date(scanData.timestamp).toLocaleString()}
                </p>
              </div>
            )}
            
            <p className="text-gray-500 text-sm">Redirecting to success page...</p>
          </div>
        )}

        {error && (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-gray-700 font-medium text-lg mb-2">Error</p>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <p className="text-gray-500 text-xs">Redirecting to dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
}
