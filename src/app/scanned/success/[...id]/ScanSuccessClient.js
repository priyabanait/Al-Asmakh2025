"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardHeader from "../../../../partner-dashboard/DashboardHeader";
import Sidebar from "../../../../components/Sidebar";
import { useAuth } from "../../../../contexts/AuthContext";

export default function ScanSuccessClient() {
  const router = useRouter();
  const params = useParams();
  const { partner, loading, isAuthenticated, isPartner } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState("scan-member");
  const [scanData, setScanData] = useState(null);
  const [loadingScan, setLoadingScan] = useState(true);
  const [error, setError] = useState("");

  // Check authentication
  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      router.push('/partner-login');
    } else if (!loading && isAuthenticated() && !isPartner()) {
      router.push('/dashboard');
    }
  }, [loading, isAuthenticated, isPartner, router]);

  // Fetch scan data
  useEffect(() => {
    const fetchScanData = async () => {
      try {
        setLoadingScan(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setError("Authentication token not found");
          return;
        }

        // For catch-all route, params.id is an array
        // Extract the scan ID from the array or URL
        let scanId = null;
        
        // Try to extract from URL pathname first (for static export compatibility)
        if (typeof window !== 'undefined') {
          const pathname = window.location.pathname;
          const match = pathname.match(/\/scanned\/success\/([^\/]+)/);
          if (match && match[1]) {
            scanId = match[1];
          }
        }
        
        // Fallback to params if pathname extraction didn't work
        if (!scanId) {
          const idParam = params.id;
          // Handle array (catch-all) or string (single param)
          if (Array.isArray(idParam)) {
            scanId = idParam[0]; // Take first element for /scanned/success/123
          } else if (idParam) {
            scanId = idParam;
          }
        }

        if (!scanId) {
          setError("Scan ID not found");
          return;
        }

        // Fetch scan data from backend
        const response = await fetch(`https://albackend.x-360.ai/api/scans/${scanId}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch scan data");
        }

        const result = await response.json();
        setScanData(result.data);
      } catch (err) {
        console.error("Error fetching scan data:", err);
        setError(err.message || "Failed to load scan data");
      } finally {
        setLoadingScan(false);
      }
    };

    // Extract scan ID from params or URL
    let scanId = null;
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      const match = pathname.match(/\/scanned\/success\/([^\/]+)/);
      if (match && match[1]) {
        scanId = match[1];
      }
    }
    if (!scanId) {
      const idParam = params.id;
      if (Array.isArray(idParam)) {
        scanId = idParam[0];
      } else if (idParam) {
        scanId = idParam;
      }
    }

    if (scanId) {
      fetchScanData();
    }
  }, [params.id, router]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleMenuItemClick = (itemId) => {
    setActiveMenuItem(itemId);

    const routes = {
      dashboard: "/partner-dashboard",
      "scan-member": "/dashboard/scan-member",
      "edit-profile": "/dashboard/edit-profile",
      signout: "/",
    };

    if (routes[itemId]) {
      router.push(routes[itemId]);
    }

    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        activeItem={activeMenuItem}
        onItemClick={handleMenuItemClick}
        userType="partner"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <DashboardHeader
          title="SCAN SUCCESS"
          description="QR code scanned successfully"
          onMenuClick={toggleSidebar}
          userType="partner"
          partnerData={partner}
        />

        {/* Content */}
        <main className="flex-1 p-2 lg:p-4">
          <div className="w-full max-w-4xl mx-auto">
            {/* Success Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              {loadingScan ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  <p>{error}</p>
                </div>
              ) : scanData ? (
                <>
                  {/* Success Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Success Message */}
                  <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
                    Scan Successful!
                  </h2>
                  <p className="text-center text-gray-600 mb-8">
                    The QR code has been scanned and recorded successfully
                  </p>

                  {/* Scan Details */}
                  <div className="space-y-4">
                    <div className="border-b border-gray-200 pb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Scan Details</h3>
                      
                      {/* Scan Type */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Scan Type</label>
                          <div className="bg-gray-50 px-3 py-2 rounded-md">
                            <span className="text-sm text-gray-900 capitalize">{scanData.scanType || 'N/A'}</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Scan ID</label>
                          <div className="bg-gray-50 px-3 py-2 rounded-md">
                            <span className="text-sm text-gray-900 font-mono">{scanData._id || 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Timestamp */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Scan Timestamp</label>
                        <div className="bg-gray-50 px-3 py-2 rounded-md">
                          <span className="text-sm text-gray-900">{formatDate(scanData.timestamp)}</span>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                        <div className="bg-gray-50 px-3 py-2 rounded-md">
                          <span className="text-sm text-gray-900 font-semibold">
                            {scanData.amount ? `${scanData.amount} QAR` : '0 QAR'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Scanned User/Partner Details */}
                    {scanData.scanType === 'user' && scanData.user && (
                      <div className="border-b border-gray-200 pb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Scanned User Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <div className="bg-gray-50 px-3 py-2 rounded-md">
                              <span className="text-sm text-gray-900">
                                {scanData.user.firstName || ''} {scanData.user.secondName || ''}
                              </span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <div className="bg-gray-50 px-3 py-2 rounded-md">
                              <span className="text-sm text-gray-900">{scanData.user.email || 'N/A'}</span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                            <div className="bg-gray-50 px-3 py-2 rounded-md">
                              <span className="text-sm text-gray-900 font-mono">{scanData.user._id || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {scanData.scanType === 'partner' && scanData.scannedPartner && (
                      <div className="border-b border-gray-200 pb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Scanned Partner Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                            <div className="bg-gray-50 px-3 py-2 rounded-md">
                              <span className="text-sm text-gray-900">
                                {scanData.scannedPartner.businessName || scanData.scannedPartner.name || 'N/A'}
                              </span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Partnership ID</label>
                            <div className="bg-gray-50 px-3 py-2 rounded-md">
                              <span className="text-sm text-gray-900 font-mono">
                                {scanData.scannedPartner.partnershipId || 'N/A'}
                              </span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <div className="bg-gray-50 px-3 py-2 rounded-md">
                              <span className="text-sm text-gray-900">{scanData.scannedPartner.email || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Partner who scanned */}
                    {scanData.partner && (
                      <div className="border-b border-gray-200 pb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Scanned By</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Partner Name</label>
                            <div className="bg-gray-50 px-3 py-2 rounded-md">
                              <span className="text-sm text-gray-900">
                                {scanData.partner.businessName || scanData.partner.name || 'N/A'}
                              </span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <div className="bg-gray-50 px-3 py-2 rounded-md">
                              <span className="text-sm text-gray-900">{scanData.partner.email || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Location and Notes */}
                    <div>
                      {scanData.location && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                          <div className="bg-gray-50 px-3 py-2 rounded-md">
                            <span className="text-sm text-gray-900">{scanData.location}</span>
                          </div>
                        </div>
                      )}
                      {scanData.notes && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                          <div className="bg-gray-50 px-3 py-2 rounded-md">
                            <span className="text-sm text-gray-900">{scanData.notes}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <button
                      onClick={() => router.push('/dashboard/scan-member')}
                      className="flex-1 bg-[#0C1E35] text-white px-6 py-3 rounded-md font-medium hover:bg-[#0a1a2e] transition-colors"
                    >
                      Scan Another QR Code
                    </button>
                    <button
                      onClick={() => router.push('/partner-dashboard')}
                      className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-md font-medium hover:bg-gray-300 transition-colors"
                    >
                      Back to Dashboard
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">No scan data found</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

