'use client'

import React from 'react'
import Image from 'next/image'

const ProfileInfo = () => {
  return (
  

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
    {/* Profile Information */}
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h2>
      <div className="flex flex-col space-y-4">

        <p  style={{fontSize: '10px'}} className="  text-gray-500">
        Hi, I’m Alec Thompson, Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality).
        </p>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Full Name</span>
          <span className="text-sm font-medium">Erhan Jackson</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Mobiler</span>
          <span className="text-sm font-medium">+974 5555 1234</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Email Address</span>
          <span className="text-sm font-medium">erhan@example.com</span>
        </div>
      
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Date of Birth</span>
          <span className="text-sm font-medium">12/05/1985</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Address</span>
          <span className="text-sm font-medium">Doha, Qatar</span>
        </div>
        <div className="flex justify-between items-center mt-0">
          <span className="text-sm text-gray-500">Social Media</span>
          <div className="flex space-x-2">
            <button className="w-5 h-6 rounded-full bg-gray-200 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </button>
            <button className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
            </button>
          </div>



          
        </div>
      </div>
    
      <div className="bg-white rounded-lg mt-5 shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium text-gray-900">Esther Jackson</h2>
          <div className=" items-center">
            <span className="text-sm text-gray-600 mr-2">ID - 538345373</span>
          </div>
        </div>
        <div className="flex items-center justify-between">

        <div>
            <button className="flex items-center gap-2 bg-black text-white text-xs font-medium py-2  w-40 h-10 px-3 rounded">
              <span>Download</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="w-24 h-24 bg-white border border-gray-200 rounded-lg p-2">
            <Image 
              src="/images/placeholder.svg" 
              alt="QR Code" 
              width={80} 
              height={80}
              className="w-full h-full"
            />
          </div>
       
        </div>
      </div>
    </div>

    {/* ID Card */}
    <div className="bg-white rounded-sm shadow">
      <div className="flex justify-center items-center">
        <IdCard/>
      </div>
    </div>

    {/* Your Profile & Members */}
    <div className="flex flex-col space-y-6">

{/* Top Cards Row */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

{/* Family ID Card */}
<div className="bg-white rounded-lg shadow p-6">


<div className="flex flex-col items-center text-center">
<div className="w-14 h-14 bg-black rounded-full flex items-center justify-center">
<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
  />
</svg>
</div> 

<h2 className="text-base font-medium text-gray-900 mt-2">Family ID</h2>

<p style={{fontSize: '10px'}} className=" mb-4   text-gray-500 mt-2">Under Your Membership</p>

<div className="border-t border-black"></div>

<p className="text-2xl font-bold">02</p>
</div>
</div>

{/* Profile Card */}
<div className="bg-white rounded-lg shadow p-6">
<div className="flex items-center justify-center mb-4">
<h2 className="text-base font-medium text-center text-gray-900">Your Profile</h2>
</div>

<div className="border-t border-gray-200"></div>


<div >
<div className="flex items-center justify-between mt-4">
<button className="bg-black text-white px-4 py-2  w-40 h-10 rounded-md text-sm font-medium hover:bg-[#17395e]">
  Edit Profile
</button>
</div>
</div>
</div>

</div>

{/* Your Members */}
<div className="bg-white rounded-lg shadow p-6">
<div className="flex items-center justify-between mb-5">
<h2 className="text-base font-medium text-gray-900">Your Members</h2>
</div>

<div className="space-y-4">
{[
{ name: 'Esthera Jackson', id: '533453873', image: '/images/placeholder.svg' },
{ name: 'Eva Jackson', id: '533453873', image: '/images/placeholder.svg' },
{ name: 'John Jackson', id: '533453873', image: '/images/placeholder.svg' }
].map((member, index) => (
<div key={index} className="flex items-center justify-between">
<div className="flex items-center space-x-3">
  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
    <Image src={member.image} alt={member.name} width={40} height={40} />
  </div>
  <div>
    <p className="text-sm font-medium">{member.name}</p>
    <p className="text-xs text-gray-500">ID - {member.id}</p>
  </div>
</div>
<button className="text-xs font-medium text-blue-600 hover:underline">View</button>
</div>
))}
</div>
</div>

</div>

  </div>
  )
}

export default ProfileInfo