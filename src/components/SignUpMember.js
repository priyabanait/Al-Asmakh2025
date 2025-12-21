import Image from "next/image";
import { FaArrowRight } from "react-icons/fa6";

export default function LoginPage() {
  return (
    <>
      {/* MOBILE FORM - Single Background Image */}
      <div className="lg:hidden relative w-full lg:h-screen h-[130vh] flex items-center justify-center">
        {/* Background Image for Mobile */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/407 (1).png')" }}
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Form Container for Mobile */}
        <div className="relative z-10 w-[90%] max-w-md">
          <div className="bg-[#8C8C8CCC] backdrop-blur-md shadow-xl rounded-xl p-6 border border-gray-400">

            <h1 className="text-2xl font-semibold text-white mb-4">Get Registered ! </h1>
            <div className="w-[80%] h-[1.5px] bg-white my-2"></div>

            <p className="text-xs mt-2 text-gray-700">
              Register today and become part of Qatar's most rewarding real estate privilege community
            </p>

            {/* 4 Input Fields - Stack on Mobile */}
            <div className="grid grid-cols-1 gap-4 mt-6">
              
              {/* Name */}
              <div>
                <label className="text-sm font-medium text-[#001730]">Name</label>
                <input
                  type="text"
                  placeholder="John Carter"
                  className="mt-1 w-full p-2.5 rounded-md border border-gray-300"
                />
              </div>
              
              {/* Email */}
              <div>
                <label className="text-sm font-medium text-[#001730]">Email</label>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  className="mt-1 w-full p-2.5 rounded-md border border-gray-300"
                />
              </div>
              
              {/* Phone */}
              <div>
                <label className="text-sm font-medium text-[#001730]">Phone</label>
                <input
                  type="text"
                  placeholder="(123) 456 - 789"
                  className="mt-1 w-full p-2.5 rounded-md border border-gray-300"
                />
              </div>
              
              {/* Password */}
              <div>
                <label className="text-sm font-medium text-[#001730]">Create Password</label>
                <input
                  type="password"
                  placeholder="Please type here . ."
                  className="mt-1 w-full p-2.5 rounded-md border border-gray-300"
                />
              </div>
            </div>

            {/* Submit */}
            <button className="bg-[#001730] justify-between text-white px-6 py-2.5 mt-6 rounded-lg font-medium text-sm hover:bg-[#002d52] transition-all duration-300 flex items-center gap-3 shadow-lg w-full">
              Submit
              <FaArrowRight size={18} className="ml-auto" />
            </button>

            {/* Divider */}
            <div className="mt-6 w-full h-[1px] bg-gray-300"></div>

            {/* Social Login */}
            <p className="text-sm text-gray-700 mt-4 mb-3 text-center">Or Sign Up with</p>

            <div className="flex gap-4">
              <button className="flex-1 py-2 border border-gray-300 rounded-md bg-white shadow">
                <Image src="/google.png" alt="Google" width={20} height={20} className="mx-auto" />
              </button>

              <button className="flex-1 py-2 border border-gray-300 rounded-md bg-white shadow">
                <Image src="/windows.png" alt="Windows" width={20} height={20} className="mx-auto" />
              </button>

              <button className="flex-1 py-2 border border-gray-300 rounded-md bg-white shadow">
                <Image src="/Linkedin.png" alt="LinkedIn" width={20} height={20} className="mx-auto" />
              </button>
            </div>

            {/* Footer */}
            <div className="text-xs font-semibold mt-8 flex flex-col justify-center text-[#001730] text-center">
              <span>
                Already have an Account - Sign In
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* LAPTOP/DESKTOP FORM - Two Images Side by Side */}
      <div className="hidden lg:flex relative w-full min-h-screen flex-row">
        {/* LEFT IMAGE (2/3 WIDTH) */}
        <div
          className="w-2/3 h-screen bg-cover bg-center"
          style={{ backgroundImage: "url('/407 (1).png')" }}
        />

        {/* RIGHT IMAGE (1/3 WIDTH) */}
        <div
          className="w-1/3 h-screen bg-fill bg-center"
          style={{ backgroundImage: "url('/office_location_background 1.png')" }}
        />

        {/* FORM OVER CENTER OF BOTH IMAGES */}
        <div className="absolute left-2/3 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-[500px] bg-[#8C8C8CCC] backdrop-blur-md shadow-xl rounded-xl p-10 border border-gray-400">

            <h1 className="text-3xl font-semibold text-white mb-4">Get Registered ! </h1>
            <div className="w-[80%] h-[1.5px] bg-white my-2"></div>

            <p className="text-sm mt-2 text-gray-700">
              Register today and become part of Qatar's most rewarding real estate privilege community
            </p>

            {/* 4 Input Fields - 2 Side by Side */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              
              {/* Name */}
              <div>
                <label className="text-sm font-medium text-[#001730]">Name</label>
                <input
                  type="text"
                  placeholder="John Carter"
                  className="mt-1 w-full p-2.5 rounded-md border border-gray-300"
                />
              </div>
              
              {/* Email */}
              <div>
                <label className="text-sm font-medium text-[#001730]">Email</label>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  className="mt-1 w-full p-2.5 rounded-md border border-gray-300"
                />
              </div>
              
              {/* Phone */}
              <div>
                <label className="text-sm font-medium text-[#001730]">Phone</label>
                <input
                  type="text"
                  placeholder="(123) 456 - 789"
                  className="mt-1 w-full p-2.5 rounded-md border border-gray-300"
                />
              </div>
              
              {/* Password */}
              <div>
                <label className="text-sm font-medium text-[#001730]">Create Password</label>
                <input
                  type="password"
                  placeholder="Please type here . ."
                  className="mt-1 w-full p-2.5 rounded-md border border-gray-300"
                />
              </div>
            </div>

            {/* Submit */}
            <button className="bg-[#001730] justify-between text-white px-8 py-2.5 mt-6 rounded-lg font-medium text-sm hover:bg-[#002d52] transition-all duration-300 flex items-center gap-3 shadow-lg w-full">
              Submit
              <FaArrowRight size={18} className="ml-12" />
            </button>

            {/* Divider */}
            <div className="mt-6 w-full h-[1px] bg-gray-300"></div>

            {/* Social Login */}
            <p className="text-sm text-gray-700 mt-4 mb-3 text-center">Or Sign Up with</p>

            <div className="flex gap-4">
              <button className="flex-1 py-2 border border-gray-300 rounded-md bg-white shadow">
                <Image src="/google.png" alt="Google" width={20} height={20} className="mx-auto" />
              </button>

              <button className="flex-1 py-2 border border-gray-300 rounded-md bg-white shadow">
                <Image src="/windows.png" alt="Windows" width={20} height={20} className="mx-auto" />
              </button>

              <button className="flex-1 py-2 border border-gray-300 rounded-md bg-white shadow">
                <Image src="/Linkedin.png" alt="LinkedIn" width={20} height={20} className="mx-auto" />
              </button>
            </div>

            {/* Footer */}
            <div className="text-xs font-semibold mt-8 flex justify-between text-[#001730]">
              <span>
                Already have an Account - Sign In
              </span>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
