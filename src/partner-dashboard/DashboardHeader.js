'use client'
import Image from 'next/image'
import { useTranslation } from '../contexts/TranslationContext'

export default function DashboardHeader ({ title, description, onMenuClick , userType, userData, partnerData}){
  const { language, switchLanguage, isTranslating } = useTranslation()
  
  // Get the appropriate name based on user type
  const getName = () => {
    if (userType === "partner") {
      return partnerData?.name || partnerData?.businessName || "User";
    } else {
      const firstName = userData?.firstName || "";
      const secondName = userData?.secondName || "";
      return firstName && secondName ? `${firstName} ${secondName}` : firstName || secondName || "User";
    }
  };

  return (
    <header className="relative">
    {/* Background Image */}
    <div style={{borderRadius: "5px"}} className="w-full h-40 m-2 relative overflow-hidden">
      <Image 
        src="/images/dashboard_bg.png" 
        alt="Dashboard Background" 
        fill
        style={{objectFit: 'cover'}}
        priority
      />
      
      {/* Mobile Menu Button */}
      {onMenuClick && (
        <button
          onClick={onMenuClick}
          className="lg:hidden absolute top-4 left-4 p-2 rounded-md text-white bg-white/10 hover:bg-white/20 transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}
      
      {/* Welcome Message Box */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full max-w-2xl px-4">
        <h1 className="text-xl lg:text-2xl font-semibold text-white mb-2">{title || ""}</h1>

        <div className="w-32  h-[0.2px] mt-4 bg-gray-200 mx-auto mb-2"></div>

        <div className=" rounded-md p-3  mx-auto max-w-xl">
          <p  style={{ fontSize:"10px " , color:"#FFF"}} className=" lg:text-sm text-white">{description || "A digital platform designed to reward tenants and staff with exclusive benefits, seamless membership management, and a connected community experience."}</p>
        </div>
      </div>
      
    
    </div>



    <div className="bg-white p-4 mt-2 m-2 w-full  items-center flex justify-between" style={{borderRadius: "5px"}}>

      <div className="flex items-center">
        <div className="w-12 h-12 bg-indigo-100 overflow-hidden mr-3" style={{borderRadius: "5px"}}>
          <Image 
            src="/images/placeholder.svg" 
            alt="Profile Photo" 
            width={50} 
            height={50}
          />
        </div>
        <p className="text-sm font-medium text-gray-700">Hello, <span className="font-bold">{getName()}</span> !</p>
      </div>

      {userType === "partner" ? (
        <>
        
        <div className="hidden md:flex mr-10   gap-4">
        <button className="bg-white font-bold text-[#001730] px-4 py-2 w-40 h-8 rounded-md text-[12px] hover:bg-[#868f98] flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
          <span>Overview</span>
        </button>

        <button className="bg-[#001730] text-white px-2 py-6 w-40 h-8 rounded-md text-[12px] font-medium hover:bg-[#17395e] flex items-center justify-center gap-2">
          {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg> */}
          <span>Quickscan</span>
        </button>
      </div>
        
        </>
      ) : (
        <></>
      )}
     

        </div>
  </header>
  )
}

