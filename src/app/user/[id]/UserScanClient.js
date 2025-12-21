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

  useEffect(() => {
    const processScan = async () => {
      // Wait for auth to load
      if (authLoading) return;

      // Check if user is authenticated and is a partner
      if (!isAuthenticated() || !isPartner()) {
        router.push('/partner-login');
        return;
      }

      // Always extract user ID from URL pathname for static export compatibility
      // Static export doesn't pass params correctly for routes not in generateStaticParams
      let userId = null;
      
      if (typeof window !== 'undefined') {
        const pathname = window.location.pathname;
        const match = pathname.match(/\/user\/([^\/]+)/);
        if (match && match[1] !== 'placeholder') {
          userId = match[1];
        }
      }
      
      // Fallback to params if pathname extraction didn't work
      if (!userId) {
        userId = serverParams?.id || clientParams?.id;
      }
      
      // Final fallback - ignore placeholder param
      if (userId === 'placeholder') {
        userId = null;
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

        // Record the scan in the backend
        const scanData = {
          userId: userId,
          amount: 0,
          location: "Mobile App",
          notes: "Scanned via QR code"
        };

        console.log("Recording user scan with data:", scanData);

        const scanResponse = await fetch("https://albackend.x-360.ai/api/scans", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(scanData)
        });

        if (!scanResponse.ok) {
          const errorData = await scanResponse.json();
          throw new Error(errorData.message || "Failed to record scan");
        }

        const scanResult = await scanResponse.json();
        console.log("Scan recorded successfully:", scanResult);
        
        setSuccess(true);
        
        // Navigate to partner-dashboard after a short delay
        setTimeout(() => {
          router.push('/partner-dashboard');
        }, 1500);

      } catch (error) {
        console.error("Error processing scan:", error);
        setError(error.message || "Could not process scan. Please try again.");
        setProcessing(false);
        
        // Navigate to partner-dashboard after showing error for 2 seconds
        setTimeout(() => {
          router.push('/partner-dashboard');
        }, 2000);
      }
    };

    processScan();
  }, [serverParams?.id, clientParams?.id, router, authLoading, isAuthenticated, isPartner]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        {processing && !error && !success && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">Processing scan...</p>
            <p className="text-gray-500 text-sm mt-2">Please wait</p>
          </div>
        )}

        {success && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-700 font-medium text-lg mb-2">Scan Recorded Successfully!</p>
            <p className="text-gray-500 text-sm">Redirecting to dashboard...</p>
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

