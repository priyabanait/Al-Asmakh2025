
'use client'

import Image from 'next/image'

const Partner = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">

    <h2 className="text-lg font-medium text-gray-900 mb-4">Our Partners</h2>
      <div className="flex flex-wrap justify-center items-center  gap-12 py-2">
        <div className="grayscale hover:grayscale-0 transition-all duration-300">
          <Image src="/partner_img/Amazon.png" alt="Amazon" width={80} height={30} />
        </div>
        <div className="grayscale hover:grayscale-0 transition-all duration-300">
          <Image src="/partner_img/Amd.png" alt="AMD" width={80} height={30} />
        </div>
        <div className="grayscale hover:grayscale-0 transition-all duration-300">
          <Image src="/partner_img/Cisco.png" alt="Cisco" width={80} height={30} />
        </div>
        <div className="grayscale hover:grayscale-0 transition-all duration-300">
          <Image src="/partner_img/Dropcam.png" alt="Dropcam" width={80} height={30} />
        </div>
        <div className="grayscale hover:grayscale-0 transition-all duration-300">
          <Image src="/partner_img/logitech.png" alt="Logitech" width={80} height={30} />
        </div>
        <div className="grayscale hover:grayscale-0 transition-all duration-300">
          <Image src="/partner_img/Spotify.png" alt="Spotify" width={80} height={30} />
        </div>
      </div>
    </div>
  )
}

export default Partner