"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import YourMembers from "./YourMembers";
import IdCard from "./IdCard";

const 
MyProfileInfo = ({
  userType,
  profileCardWidth,
  profileCardHeight,
  profileCardClassName,
  statsCardHeight,
  userData,
  partnerData,
}) => {
  // Use the appropriate data based on user type
  const profileData = userType === "partner" ? partnerData : userData;

  // Refs for the ID card elements
  const idCardRef = useRef(null);
  const userIdCardRef = useRef(null);

  // Function to download ID card as PDF
  const downloadIdCard = async (cardRef, fileName) => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [100, 180],
      });

      const imgWidth = 90;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const xPos = (pdf.internal.pageSize.getWidth() - imgWidth) / 2;
      const yPos = 10;

      pdf.addImage(imgData, "PNG", xPos, yPos, imgWidth, imgHeight);
      pdf.save(`${fileName || "id-card"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to download ID card. Please try again.");
    }
  };

  return (
    <div className="w-full px-4">
      <div className=" max-w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10 mb-4">
          {/* Left Column - Profile and QR Code */}
          <div className="flex flex-col gap-8 min-w-[300px] max-w-[600px] mx-auto">
            {/* Profile Information Box */}
            <div
              className={`bg-white p-4 ${profileCardClassName || ""}  `}
              style={{
                borderRadius: "5px",
                width: profileCardWidth || "100%",
                maxWidth: "600px",
                height: profileCardHeight || "auto",
                minHeight: userType === "partner" ? "380px" : "300px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Profile Information
              </h2>
              <div className="flex flex-col gap-2">
                <p style={{ fontSize: "10px" }} className="text-gray-400 mb-2">
                  Hi, I’m {profileData?.name}, Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality).
                </p>
                <div className="flex gap-4">
                  <span className="text-[12px] text-gray-600 font-medium min-w-[82px]">Full Name:</span>
                  <span style={{ fontSize: "10px" }} className="text-[12px] text-gray-400">
                    {userType === "partner"
                      ? profileData?.name
                      : `${profileData?.firstName || ""} ${profileData?.secondName || ""}`}
                  </span>
                </div>
                <div className="flex gap-4">
                  <span className="text-[12px] text-gray-600 font-medium min-w-[82px]">Mobile:</span>
                  <span style={{ fontSize: "10px" }} className="text-[12px] text-gray-400">
                    {userType === "partner" ? profileData?.phoneNumber : profileData?.phone}
                  </span>
                </div>
                <div className="flex gap-4">
                  <span className="text-[12px] text-gray-600 font-medium min-w-[82px]">Email:</span>
                  <span style={{ fontSize: "10px" }} className="text-[12px] text-gray-400">
                    {profileData?.email}
                  </span>
                </div>
                {userType === "partner" ? (
                  <>
                    <div className="flex gap-4">
                      <span className="text-[12px] text-gray-600 font-medium min-w-[82px]">Nature of Business:</span>
                      <span style={{ fontSize: "10px" }} className="text-[12px] text-gray-400">Restaurant</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-[12px] text-gray-600 font-medium min-w-[82px]">Website:</span>
                      <span style={{ fontSize: "10px" }} className="text-[12px] text-gray-400">www.alasmakh.com</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-[12px] text-gray-600 font-medium min-w-[82px]">Google Link:</span>
                      <span style={{ fontSize: "10px" }} className="text-[12px] text-gray-400">xxxxxxxxxxxx</span>
                    </div>
                  </>
                ) : (
                  <div className="flex gap-4">
                    <span className="text-[12px] text-gray-600 font-medium min-w-[82px]">Nationality:</span>
                    <span style={{ fontSize: "10px" }} className="text-[12px] text-gray-400">{userData?.nationality || ""}</span>
                  </div>
                )}
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-[12px] text-gray-600 font-medium">Social Media:</span>
                  <div className="flex space-x-2">
                    <button className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#001730]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                      </svg>
                    </button>
                    <button className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#001730]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                      </svg>
                    </button>
                    <button className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200" aria-label="Instagram">
                      <svg viewBox="0 0 448 512" className="h-4 w-4 text-[#001730]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9 114.9-51.3 114.9-114.9-51.3-114.9-114.9-114.9zm0 186c-39.3 0-71.1-31.8-71.1-71.1s31.8-71.1 71.1-71.1 71.1 31.8 71.1 71.1-31.8 71.1-71.1 71.1zm146.4-194.3c0 14.9-12 26.9-26.9 26.9-14.9 0-26.9-12-26.9-26.9s12-26.9 26.9-26.9 26.9 12 26.9 26.9zm76.1 27.2c-1.7-35.3-9.9-66.7-36.2-92.9-26.3-26.3-57.7-34.5-92.9-36.2-36.7-2.1-146.7-2.1-183.4 0-35.3 1.7-66.7 9.9-92.9 36.2S9.8 67.8 8.1 103c-2.1 36.7-2.1 146.7 0 183.4 1.7 35.3 9.9 66.7 36.2 92.9 26.3 26.3 57.7 34.5 92.9 36.2 36.7 2.1 146.7 2.1 183.4 0 35.3-1.7 66.7-9.9 92.9-36.2 26.3-26.3 34.5-57.7 36.2-92.9 2.1-36.7 2.1-146.7 0-183.4zm-48.5 232c-7.8 19.6-23 34.8-42.6 42.6-29.5 11.7-99.3 9-132.4 9s-102.9 2.6-132.4-9c-19.6-7.8-34.8-23-42.6-42.6-11.7-29.5-9-99.3-9-132.4s-2.6-102.9 9-132.4c7.8-19.6 23-34.8 42.6-42.6 29.5-11.7 99.3-9 132.4-9s102.9-2.6 132.4 9c19.6 7.8 34.8 23 42.6 42.6 11.7 29.5 9 99.3 9 132.4s2.7 102.9-9 132.4z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* QR Code Box */}
            {userType === "partner" ? null : (
              <div className="bg-white shadow p-4 w-full max-w-md rounded-md">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex-1 w-full">
                    <div className="flex flex-col mb-4">
                      <h2 className="text-base font-medium text-gray-900 mb-1">
                        {userData ? `${userData.firstName} ${userData.secondName}` : "User Name"}
                      </h2>
                      <div>
                        <span className="text-[12px] text-gray-400">
                          ID - {userData?._id ? userData._id.substring(0, 8) : "No ID"}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => downloadIdCard(userIdCardRef, `${userData?.firstName || "user"}_id_card`)}
                      className="flex items-center justify-center gap-2 bg-[#001730] text-white text-xs font-medium py-2 w-full md:w-56 h-10 rounded-md"
                    >
                      <span>Download</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex-shrink-0 w-32 h-32 md:w-36 md:h-36 bg-white rounded-lg p-3 flex items-center justify-center">
                    {userData?._id ? (
                      <>
                        <QRCodeSVG
                          value={`https://privilege.alasmakhrealestate.com/user/${userData._id}`}
                          size={100}
                          level="H"
                          includeMargin={true}
                          className="md:hidden"
                        />
                        <QRCodeSVG
                          value={`https://privilege.alasmakhrealestate.com/user/${userData._id}`}
                          size={120}
                          level="H"
                          includeMargin={true}
                          className="hidden md:block"
                        />
                      </>
                    ) : (
                      <Image
                        src="/images/download.png"
                        alt="QR Code"
                        width={80}
                        height={80}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* Hidden div for user ID card download */}
            <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
              <div
                ref={userIdCardRef}
                style={{
                  width: "300px",
                  height: "500px",
                  backgroundColor: "white",
                  padding: "20px",
                  position: "relative",
                  borderRadius: "10px",
                }}
              >
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#001730" }}>
                    Al-Asmakh Privilege Program
                  </h2>
                  <div style={{ width: "80%", height: "1px", backgroundColor: "#ccc", margin: "10px auto" }}></div>
                </div>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <div
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      backgroundColor: "#f0f0f0",
                      margin: "0 auto 15px",
                      overflow: "hidden",
                      border: "3px solid #001730",
                    }}
                  >
                    <img src="/images/person_icon.png" alt="User" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <h3 style={{ fontSize: "16px", fontWeight: "bold", margin: "5px 0" }}>
                    {userData ? `${userData.firstName} ${userData.secondName}` : "User Name"}
                  </h3>
                  <p style={{ fontSize: "12px", color: "#666" }}>
                    Member ID: {userData?._id ? userData._id.substring(0, 8) : "No ID"}
                  </p>
                </div>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  {userData?._id && (
                    <div style={{ width: "150px", height: "150px", margin: "0 auto", backgroundColor: "white", padding: "10px" }}>
                      <QRCodeSVG
                        value={`https://privilege.alasmakhrealestate.com/user/${userData._id}`}
                        size={130}
                        level="H"
                        includeMargin={true}
                      />
                    </div>
                  )}
                </div>
                <div style={{ fontSize: "12px", color: "#333", marginTop: "15px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span>Email:</span>
                    <span>{userData?.email || "N/A"}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span>Phone:</span>
                    <span>{userData?.phone || "N/A"}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span>Nationality:</span>
                    <span>{userData?.nationality || "N/A"}</span>
                  </div>
                </div>
                <div style={{ position: "absolute", bottom: "20px", left: "0", right: "0", textAlign: "center" }}>
                  <p style={{ fontSize: "10px", color: "#666" }}>This card is the property of Al-Asmakh Privilege Program</p>
                  <p style={{ fontSize: "10px", color: "#666" }}>
                    Valid until: {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Right Side - Conditional Rendering */}
          {userType === "partner" ? (
            /* Partner Dashboard Design */ 
            <div className="lg:col-span-2 w-full max-w-3xl max-auto mr-10 md:ml-10
            +  5xl:max-w-6xl 5xl:ml-10 5xl:mx-auto 5xl:gap-10">
              <div className="flex flex-col lg:flex-row gap-2 lg:gap-2 md:gap-4 mb-4 lg:mb-0">
                {/* Partner ID Card */}
                <div className="bg-white shadow p-3 rounded-md w-full lg:w-auto lg:max-w-[270px] lg:min-w-[210px] mx-auto lg:mx-2 mb-4 lg:mb-0 flex justify-center" >
                  <div className="flex flex-col items-center w-full">
                    <img src="./partner_img/partner.png" style={{ width: "100px" }} alt="Partner Logo" className="mb-4" />
                    <h2 className="text-lg font-medium text-gray-900 mb-2">Partner ID</h2>
                    <div className="w-28 h-[1px] bg-gray-200 mx-auto mb-4"></div>
                    <div className="w-32  h-28 bg-white rounded-lg p-3 flex items-center justify-center mb-4">
                      {partnerData?.partnershipId ? (
                        <QRCodeSVG
                          value={`https://privilege.alasmakhrealestate.com/partner/${partnerData.partnershipId}`}
                          size={112}
                          level="H"
                          includeMargin={true}
                        />
                      ) : (
                        <div className="text-center text-gray-400 text-xs">No ID available</div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{partnerData?.partnershipId || "No ID"}</p>
                    <button
                      onClick={() => downloadIdCard(idCardRef, `${partnerData?.name || "partner"}_id_card`)}
                      className="flex items-center justify-center gap-2 bg-[#001730] text-white px-4 py-2 w-32 rounded-md text-[12px] font-medium hover:bg-[#17395e]"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>Download</span>
                    </button>
                  </div>
                </div>
                {/* Hidden div for partner ID card download */}
                <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
                  <div
                    ref={idCardRef}
                    style={{
                      width: "300px",
                      height: "520px",
                      backgroundColor: "white",
                      padding: "20px",
                      position: "relative",
                      borderRadius: "10px",
                    }}
                  >
                    <div style={{ textAlign: "center", marginBottom: "20px" }}>
                      <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#001730" }}>
                        Al-Asmakh Privilege Program
                      </h2>
                      <h3 style={{ fontSize: "14px", fontWeight: "bold", color: "#001730", marginTop: "5px" }}>PARTNER</h3>
                      <div style={{ width: "80%", height: "1px", backgroundColor: "#ccc", margin: "10px auto" }}></div>
                    </div>
                    <div style={{ textAlign: "center", marginBottom: "20px" }}>
                      <div
                        style={{
                          width: "100px",
                          height: "100px",
                          borderRadius: "50%",
                          backgroundColor: "#f0f0f0",
                          margin: "0 auto 15px",
                          overflow: "hidden",
                          border: "3px solid #001730",
                        }}
                      >
                        <img src="/images/partner.png" alt="Partner" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <h3 style={{ fontSize: "16px", fontWeight: "bold", margin: "5px 0" }}>
                        {partnerData?.name || "Partner Name"}
                      </h3>
                      <p style={{ fontSize: "12px", color: "#666" }}>
                        Partnership ID: {partnerData?.partnershipId || "No ID"}
                      </p>
                    </div>
                    <div style={{ textAlign: "center", marginBottom: "20px" }}>
                      {partnerData?.partnershipId && (
                        <div style={{ width: "150px", height: "150px", margin: "0 auto", backgroundColor: "white", padding: "10px" }}>
                          <QRCodeSVG
                            value={`https://privilege.alasmakhrealestate.com/partner/${partnerData.partnershipId}`}
                            size={130}
                            level="H"
                            includeMargin={true}
                          />
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: "12px", color: "#333", marginTop: "15px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span>Email:</span>
                        <span>{partnerData?.email || "N/A"}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span>Phone:</span>
                        <span>{partnerData?.phoneNumber || "N/A"}</span>
                      </div>
                    </div>
                    <div style={{ position: "absolute", bottom: "20px", left: "0", right: "0", textAlign: "center" }}>
                      <p style={{ fontSize: "10px", color: "#666" }}>This card is the property of Al-Asmakh Privilege Program</p>
                      <p style={{ fontSize: "10px", color: "#666" }}>
                        Valid until: {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Partner Statisticsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss */}
                <div className="flex-1 w-full max-w-[550px] ml-0 lg:ml-0">
                  <div
                    className="bg-white rounded-lg shadow p-4 "
                    style={{
                      height: statsCardHeight || "auto",
                      minHeight: "360px",
                      maxHeight: statsCardHeight || "none",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: "15px",
                    }}
                  >
                    <div className="mt-2 h-36 bg-gradient-to-r from-[#313860] to-[#151928] rounded-[15px] flex items-end justify-center px-2 sm:px-4 gap-1 sm:gap-2 md:gap-4 lg:gap-6 overflow-x-auto">
                      {[40, 65, 35, 50, 70, 30, 55, 25, 45, 60, 35, 50].map((height, index) => (
                        <div
                          key={index}
                          className="w-1.5 sm:w-2 md:w-2.5 lg:w-2 bg-white rounded-t-[15px] flex-shrink-0"
                          style={{ height: `${height}%`, minHeight: '4px' }}
                        ></div>
                      ))}
                    </div>
                    <div className="mt-6 mb-2">
                      <h2 className="text-base font-medium text-gray-900">Active Members</h2>
                      <p style={{ fontSize: "10px" }} className="text-gray-400">last week</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mt-4 sm:mt-8 mb-4 lg:mb-0">
                      <div>
                        <div className="flex items-center mb-1">
                          <div className="w-5 h-5 bg-[#4FD1C5] rounded mr-2 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="text-xs text-gray-400 text-nowrap">Total Members</p>
                        </div>
                        <p className="text-[14px] font-bold text-black">00,00</p>
                        <div className="w-full bg-gray-200 rounded-[15px] h-0.5 mt-2">
                          <div className="bg-[#4FD1C5] h-0.5 rounded-[15px]" style={{ width: "75%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center mb-1">
                          <div className="w-5 h-5 bg-[#4FD1C5] rounded mr-2 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="text-xs text-gray-400">Sales</p>
                        </div>
                        <p className="text-[14px] font-bold text-black">00,00$</p>
                        <div className="w-full bg-gray-200 rounded-[15px] h-0.5 mt-2">
                          <div className="bg-[#4FD1C5] h-0.5 rounded-[15px]" style={{ width: "60%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center mb-1">
                          <div className="w-5 h-5 bg-[#4FD1C5] rounded mr-2 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="text-xs text-gray-400 text-nowrap">Monthly Members</p>
                        </div>
                        <p className="text-[14px] font-bold text-black">00,00</p>
                        <div className="w-full bg-gray-200 rounded-[15px] h-0.5 mt-2">
                          <div className="bg-[#4FD1C5] h-0.5 rounded-[15px]" style={{ width: "50%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Regular User Dashboard Design */
            <>
              {/* ID Card */}
              <div className="bg-white shadow p-4 rounded-md w-full mx-auto md:ml-20 md:w-[265px]">
                <div className="flex flex-col items-center">
                  <div className="w-full max-w-[220px]">
                    <div className="relative">
                      <div className="flex flex-col items-center mt-4">
                        <div className="w-full h-full overflow-hidden">
                          <IdCard userData={userData} partnerData={partnerData} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Your Profile & Members */}
              <div className="flex flex-col space-y-6">
                {/* Top Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Family ID Card */}
                  <div className="bg-white rounded-lg shadow p-4" style={{ borderRadius: "5px" }}>
                    <div className="flex flex-col items-center text-center">
                      <div className="flex items-center justify-center">
                        <Image src="/images/person_icon.png" alt="Family ID" width={86} height={86} />
                      </div>
                      <h2 className="text-base font-medium text-gray-900 mt-2">Family ID</h2>
                      <p style={{ fontSize: "8px" }} className="text-gray-400 mt-0">Under Your Membership</p>
                      <div className="w-3/4 h-[1px] mt-4 bg-gray-200 mx-auto mb-2"></div>
                      <p className="text-[14px] font-bold">02</p>
                    </div>
                  </div>
                  {/* Profile Card */}
                  <div className="bg-white rounded-lg shadow p-6" style={{ borderRadius: "5px" }}>
                    <div className="flex items-center justify-center mt-5 mb-4">
                      <h2 className="text-base font-medium text-center text-gray-900">Your Profile</h2>
                    </div>
                    <div className="border-t border-gray-200"></div>
                    <div className="flex items-center justify-between mt-4">
                      <button className="bg-[#001730] text-white w-44 h-7 rounded-md text-[12px] font-medium hover:bg-[#17395e]">
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </div>
                {/* Your Members */}
                <YourMembers />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfileInfo;