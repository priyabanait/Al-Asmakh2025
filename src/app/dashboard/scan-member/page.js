"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "../../../partner-dashboard/DashboardHeader";
import Sidebar from "../../../components/Sidebar";
import Image from "next/image";
import Members from "../../../partner-dashboard/Members";
import QRScanner from "../../../components/QRScanner";
import { useAuth } from "../../../contexts/AuthContext";

export default function ScanMemberPage() {
  const router = useRouter();
  const { partner, loading, isAuthenticated, isPartner, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState("scan-member");
  const [scannedUser, setScannedUser] = useState(null);
  const [scanError, setScanError] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Key to trigger Members refresh
  const [memberDetails, setMemberDetails] = useState({
    phone: "",
    membershipId: "",
    amount: ""
  });
  
  // Check authentication
  useEffect(() => {
    // Wait for loading to complete
    if (loading) return;
    
    // Check token in localStorage
    const token = localStorage.getItem('token');
    const partnerData = localStorage.getItem('partnerData');
    
    // If no token, redirect to login
    if (!token) {
      router.push('/partner-login');
      return;
    }
    
    // If authenticated but no partner data, redirect to partner dashboard (main page)
    if (!partner && !partnerData) {
      router.push('/partner-login');
      return;
    }
  }, [loading, partner, router]);
  
  // Handle QR scan result
  const handleScan = async (result) => {
    if (result && result.data) {
      try {
        // Get token for authentication
        const token = localStorage.getItem('token');
        if (!token) {
          setScanError("Authentication token not found. Please log in again.");
          return;
        }

        // Parse the QR code URL
        const url = new URL(result.data);
        const pathParts = url.pathname.split('/').filter(part => part !== '');
        
        console.log("QR Code scanned:", result.data);
        console.log("Path parts:", pathParts);
        
        // Check if it's a partner QR code or user QR code
        const isPartnerScan = pathParts.includes('partner');
        const isUserScan = pathParts.includes('user');
        
        if (isPartnerScan) {
          // Handle partner QR code scan
          // Expected format: https://privilege.alasmakhrealestate.com/partner/PARTNERSHIP_ID
          const partnershipId = pathParts[pathParts.length - 1];
          
          if (!partnershipId) {
            setScanError("Invalid partner QR code format");
            return;
          }
          
          try {
            console.log("Fetching partner data for partnershipId:", partnershipId);
            
            // Fetch partner data by partnershipId
            const partnerResponse = await fetch(`https://albackend.x-360.ai/api/partners/partnership/${partnershipId}`, {
              headers: {
                "Authorization": `Bearer ${token}`
              }
            });
            
            if (!partnerResponse.ok) {
              const errorData = await partnerResponse.json();
              throw new Error(errorData.message || "Failed to fetch partner data");
            }
            
            const partnerData = await partnerResponse.json();
            const scannedPartner = partnerData.data;
            
            console.log("Partner data fetched:", scannedPartner);
            
            // Set the scanned partner data
            setScannedUser({
              id: scannedPartner._id,
              firstName: scannedPartner.firstName || scannedPartner.name || '',
              secondName: '',
              email: scannedPartner.email || '',
              phone: scannedPartner.phone || scannedPartner.phoneNumber || '',
              membershipId: scannedPartner.partnershipId,
              isPartner: true,
              businessName: scannedPartner.businessName || ''
            });
            
            // Update form fields
            setMemberDetails({
              phone: scannedPartner.phone || scannedPartner.phoneNumber || '',
              membershipId: scannedPartner.partnershipId,
              amount: ""
            });
            
            // Record the scan in the backend
            const scanData = {
              partnershipId: partnershipId,
              amount: 0,
              location: "Mobile App",
              notes: `Scanned partner QR code: ${scannedPartner.businessName || scannedPartner.name}`
            };
            
            console.log("Recording partner scan with data:", scanData);
            
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
              throw new Error(errorData.message || "Failed to record partner scan");
            }
            
            const scanResult = await scanResponse.json();
            console.log("Partner scan recorded successfully:", scanResult);
            
            // Close scanner modal
            setShowScanner(false);
            
            // Navigate to success page with scan ID
            if (scanResult.data && scanResult.data._id) {
              router.push(`/scanned/success/${scanResult.data._id}`);
            } else {
              // Fallback if no scan ID
              setScanError("Scan recorded but no ID returned");
              alert("Scan recorded successfully but could not navigate to success page");
            }
            
          } catch (fetchError) {
            console.error("Error fetching partner data:", fetchError);
            setScanError(fetchError.message || "Could not fetch partner data. Please try again.");
            alert(`Error: ${fetchError.message || "Could not fetch partner data. Please try again."}`);
          }
          
        } else if (isUserScan) {
          // Handle user QR code scan
          // Expected format: https://alasmakh.com/user/USER_ID
          const userId = pathParts[pathParts.length - 1];
          
          if (!userId) {
            setScanError("Invalid user QR code format");
            return;
          }
          
          try {
            console.log("Fetching user data for ID:", userId);
            
            // Fetch user details from the backend
            const userResponse = await fetch(`https://albackend.x-360.ai/api/users/${userId}`, {
              headers: {
                "Authorization": `Bearer ${token}`
              }
            }).catch(() => {
              // If the API doesn't exist yet, simulate a successful response
              console.log("Using simulated user data (API not available)");
              return {
                ok: true,
                json: async () => ({
                  success: true,
                  data: {
                    _id: userId,
                    firstName: "John",
                    secondName: "Doe",
                    email: "john.doe@example.com",
                    phone: "123-456-7890"
                  }
                })
              };
            });
            
            const userData = await userResponse.json();
            
            if (!userResponse.ok) {
              throw new Error(userData.message || "Failed to fetch user data");
            }
            
            const user = userData.data;
            console.log("User data fetched:", user);
            
            // Ensure _id is converted to string (handle both ObjectId objects and strings)
            const userIdString = user._id ? String(user._id) : String(userId);
            
            // Set the scanned user data
            setScannedUser({
              id: userIdString,
              firstName: user.firstName,
              secondName: user.secondName,
              email: user.email,
              phone: user.phone,
              membershipId: userIdString.substring(0, 8),
              isPartner: false
            });
            
            // Update form fields
            setMemberDetails({
              phone: user.phone,
              membershipId: userIdString.substring(0, 8),
              amount: ""
            });
            
            // Record the scan in the backend
            const scanData = {
              userId: userIdString,
              amount: 0, // Will be updated when the partner submits the form
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
            
            // Close scanner modal
            setShowScanner(false);
            
            // Navigate to success page with scan ID
            if (scanResult.data && scanResult.data._id) {
              router.push(`/scanned/success/${scanResult.data._id}`);
            } else {
              // Fallback if no scan ID
              setScanError("Scan recorded but no ID returned");
              alert("Scan recorded successfully but could not navigate to success page");
            }
            
          } catch (fetchError) {
            console.error("Error fetching user data:", fetchError);
            setScanError(fetchError.message || "Could not fetch user data. Please try again.");
            alert(`Error: ${fetchError.message || "Could not fetch user data. Please try again."}`);
          }
        } else {
          setScanError("Invalid QR code format. Expected partner or user QR code.");
        }
      } catch (error) {
        console.error("Error processing QR code:", error);
        if (error.message) {
          setScanError(error.message);
        } else {
          setScanError("Could not process QR code. Please ensure the QR code is valid.");
        }
      }
    }
  };
  
  // Handle QR scan error
  const handleScanError = (error) => {
    console.error("QR scan error:", error);
    setScanError("Error scanning QR code");
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMemberDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Check if all three fields are filled
  const isFormValid = memberDetails.phone && memberDetails.membershipId && memberDetails.amount;

  // Handle manual data submission
  const handleSubmitManualData = async () => {
    if (!isFormValid) {
      alert("Please fill all three fields: Phone, Membership ID, and Amount");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Authentication token not found. Please log in again.");
        return;
      }

      let scanData = {};
      
      // Try to find user by membershipId (could be user ID, customerId, or tenantId)
      try {
        const userResponse = await fetch(`https://albackend.x-360.ai/api/users/${memberDetails.membershipId}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          if (userData.success && userData.data) {
            scanData = {
              userId: userData.data._id,
              amount: parseFloat(memberDetails.amount),
              location: "Mobile App - Manual Entry",
              notes: `Manual entry: Phone: ${memberDetails.phone}, Membership ID: ${memberDetails.membershipId}`
            };
          }
        }
      } catch (err) {
        console.log("Could not find user, trying partner...");
      }

      // If user not found, try to find partner by partnershipId
      if (!scanData.userId) {
        try {
          const partnerResponse = await fetch(`https://albackend.x-360.ai/api/partners/partnership/${memberDetails.membershipId}`, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });

          if (partnerResponse.ok) {
            const partnerData = await partnerResponse.json();
            if (partnerData.success && partnerData.data) {
              scanData = {
                partnershipId: memberDetails.membershipId,
                amount: parseFloat(memberDetails.amount),
                location: "Mobile App - Manual Entry",
                notes: `Manual entry: Phone: ${memberDetails.phone}, Membership ID: ${memberDetails.membershipId}`
              };
            }
          }
        } catch (err) {
          console.log("Could not find partner");
        }
      }

      // If still no user or partner found, use membershipId as userId (backend will validate)
      if (!scanData.userId && !scanData.partnershipId) {
        scanData = {
          userId: memberDetails.membershipId,
          amount: parseFloat(memberDetails.amount),
          location: "Mobile App - Manual Entry",
          notes: `Manual entry: Phone: ${memberDetails.phone}, Membership ID: ${memberDetails.membershipId}`
        };
      }

      // Submit the scan
      const response = await fetch("https://albackend.x-360.ai/api/scans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(scanData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to record scan");
      }

      const result = await response.json();
      console.log("Manual scan recorded successfully:", result);

      // Show success message
      alert(`Scan recorded successfully: ${memberDetails.amount} QAR for ${memberDetails.phone || memberDetails.membershipId}`);

      // Reset form
      setMemberDetails({
        phone: "",
        membershipId: "",
        amount: ""
      });
      setScannedUser(null);

      // Refresh members list
      setRefreshKey(prev => prev + 1);

    } catch (error) {
      console.error("Error recording manual scan:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);


  const handleMenuItemClick = (itemId) => {
    setActiveMenuItem(itemId)
    

    console.log(itemId);
    // Handle navigation for partner dashboard
    if (itemId === 'scan-member') {
      router.push('/dashboard/scan-member')
      return
    }

    if (itemId === 'dashboard') {
      router.push('/partner-dashboard')
      return
    }
    
    if (itemId === 'edit-profile') {
      router.push('/partner-dashboard/edit-profile')
      return
    }
    
    if (itemId === 'signout') {
      logout()
      return
    }
    
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }


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
          title="WELCOME BACK !"
          description="A digital platform designed to reward tenants and staff with exclusive benefits, seamless membership management, and a connected community experience."
          onMenuClick={toggleSidebar}
          userType="partner"
          partnerData={partner}
        />

        {/* Content */}
        <main className="flex-1 p-2 lg:p-4">
          <div className="w-full">
            {/* === TOP CARD SECTION === */}
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="relative w-full md:w-80 overflow-hidden rounded-lg h-[200px] md:h-auto">
                <div className="bg-[#0C1E35] p-4 rounded-lg h-full">
                  <h3 className="text-white text-sm font-medium mb-4">
                    Scan Member QR Code
                  </h3>

                  {/* <div className="relative w-full md:w-80 h-40 overflow-hidden 
                  rounded-lg"> */}
                  {" "}
                  <div
                    className="absolute inset-0 bg-[#0C1E35] flex flex-col min-h-[190px] md:min-h-0"
                    style={{
                      backgroundImage: "url('/images/Background.png')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    {" "}
                    <p 
                      className="text-white text-sm font-medium pl-4 md:pl-6 pt-3 cursor-pointer hover:underline"
                      onClick={() => {
                        setShowScanner(true);
                        setScanError('');
                        setScannedUser(null);
                      }}
                    >
                      Click Here to scan QR
                    </p>{" "}
                    <div className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2">
                      {" "}
                      <div className="bg-white p-2 md:p-3 rounded-md shadow-md">
                        {" "}
                        <img
                          src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Dummy"
                          alt="QR"
                          className="w-[60px] h-[60px] md:w-[80px] md:h-[80px]"
                        />{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                </div>
              </div>

              {/* QR Scanner Modal */}
              {showScanner && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                  <div className="bg-white p-4 rounded-lg w-full max-w-md">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Scan Member QR Code</h3>
                      <button 
                        onClick={() => setShowScanner(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* QR Scanner Component */}
                    <QRScanner 
                      key={showScanner ? 'scanner-active' : 'scanner-inactive'}
                      autoStart={true}
                      onScan={(result) => {
                        handleScan(result);
                        setShowScanner(false);
                        setScanError('');
                      }}
                      onError={(error) => {
                        handleScanError(error);
                        // Don't close on error, let user see the error message
                      }}
                    />
                    
                    {/* Error Message */}
                    {scanError && (
                      <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 text-xs rounded">
                        {scanError}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Success Message */}
              {scannedUser && (
                <div className="mt-2 p-2 bg-green-100 border border-green-400 text-green-700 text-xs rounded absolute bottom-4 left-4 right-4">
                  Successfully scanned {scannedUser.isPartner ? 'Partner: ' : ''}{scannedUser.firstName} {scannedUser.secondName || (scannedUser.isPartner ? scannedUser.businessName : '')}
                  {scannedUser.isPartner && ` (${scannedUser.membershipId})`}
                </div>
              )}

              {/* RIGHT: Member Details Section */}
              <div className="flex flex-col flex-1 bg-white border border-gray-100 rounded-lg p-6 relative">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-[#2D3748] font-bold text-base">
                    Member Details:
                  </h2>
                  {/* Submit Button - Show when all fields are filled */}
                  {isFormValid && (
                    <button
                      onClick={handleSubmitManualData}
                      className="bg-[#0C1E35] text-white px-4 py-2 rounded-md text-xs font-medium hover:bg-[#0a182a] transition-colors shadow-sm"
                    >
                      Submit
                    </button>
                  )}
                </div>

                <div className="flex flex-col md:flex-row gap-6 w-full">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={memberDetails.phone}
                      onChange={handleInputChange}
                      placeholder="Enter here..."
                      className="w-full border border-gray-200 rounded-md px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Membership ID
                    </label>
                    <input
                      type="text"
                      name="membershipId"
                      value={memberDetails.membershipId}
                      onChange={handleInputChange}
                      placeholder="Enter here..."
                      className="w-full border border-gray-200 rounded-md px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Amount
                    </label>
                    <input
                      type="text"
                      name="amount"
                      value={memberDetails.amount}
                      onChange={handleInputChange}
                      placeholder="Enter here..."
                      className="w-full border border-gray-200 rounded-md px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300"
                    />
                  </div>
                  
                  {/* Submit Button */}
                  {/* <div className="absolute bottom-4 right-4">
                    <button 
                      className="bg-[#0C1E35] text-white px-4 py-2 rounded text-xs"
                      onClick={async () => {
                        if (!scannedUser) {
                          alert("Please scan a member QR code first");
                          return;
                        }
                        
                        if (!memberDetails.amount) {
                          alert("Please enter an amount");
                          return;
                        }
                        
                        try {
                          const token = localStorage.getItem('token');
                          if (!token) {
                            alert("Authentication token not found. Please log in again.");
                            return;
                          }
                          
                          // Update the scan with the transaction amount
                          const response = await fetch("https://albackend.x-360.ai/api/scans", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify({
                              userId: String(scannedUser.id),
                              amount: parseFloat(memberDetails.amount),
                              location: "Mobile App",
                              notes: "Transaction recorded via scan"
                            })
                          });
                          
                          if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.message || "Failed to record transaction");
                          }
                          
                          // Transaction recorded successfully
                          alert(`Transaction recorded: ${memberDetails.amount} QAR for member ${scannedUser.firstName} ${scannedUser.secondName}`);
                          
                          // Reset form
                          setMemberDetails({
                            phone: "",
                            membershipId: "",
                            amount: ""
                          });
                          setScannedUser(null);
                          
                        } catch (error) {
                          console.error("Error recording transaction:", error);
                          alert(`Error: ${error.message}`);
                        }
                      }}
                    >
                      Record Transaction
                    </button>
                  </div> */}
                </div>
              </div>
            </div>

            {/* === MEMBERS LIST === */}
            <Members key={refreshKey} />
          </div>
        </main>
      </div>
    </div>
  );
}