import Image from "next/image";
import { FaArrowRight } from "react-icons/fa6";

export default function LoginPage() {
  return (
    <>
      {/* MOBILE FORM - Single Background Image */}
      <div className="lg:hidden relative w-full min-h-screen flex items-center justify-center">
        {/* Background Image for Mobile */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/407 (1).png')" }}
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/30 " />

        {/* Form Container for Mobile */}
        <div className="relative z-10 w-[90%] max-w-md ">
          <div className="bg-[#8C8C8CCC] backdrop-blur-md shadow-xl rounded-xl p-6 border border-gray-400">

            <h1 className="text-2xl font-semibold text-white mb-4">
              Welcome Back !
            </h1>

            <div className="w-full h-[1.5px] bg-white mb-3"></div>

            <p className="text-xs text-gray-700">
              Access your Al Asmakh dashboard to view benefits, update details, and stay connected.
            </p>

            {/* Email */}
            <div className="mt-6">
              <label className="text-sm font-medium text-[#001730]">Email</label>
              <input
                type="email"
                placeholder="John Carter"
                className="mt-1 w-full p-2.5 rounded-md border border-gray-300"
              />
            </div>

            {/* Password */}
            <div className="mt-4">
              <label className="text-sm font-medium text-[#001730]">Password</label>
              <input
                type="password"
                placeholder="Please enter password here . ."
                className="mt-1 w-full p-2.5 rounded-md border border-gray-300"
              />
            </div>

            {/* Submit */}
            <button className="bg-[#001730] justify-between text-white px-6 py-2.5 mt-6 rounded-lg font-medium text-sm hover:bg-[#002d52] transition-all duration-300 flex items-center gap-3 shadow-lg w-full">
              Submit
              <FaArrowRight size={18} className="ml-auto" />
            </button>

            <div className="mt-6 w-full h-[1px] bg-gray-300"></div>

            <p className="text-sm text-gray-700 mt-4 mb-3 text-center">
              Or Sign Up with
            </p>

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

            <div className="text-xs font-semibold mt-8 flex flex-col justify-between text-[#001730] gap-2 text-center">
              <span>
                Forgot Password - <a className="text-[#001730]">RESET</a>
              </span>

              <span>
                Do Not have an Account - <a className="text-[#001730]">SIGN UP</a>
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* LAPTOP/DESKTOP FORM - Two Images Side by Side */}
      <div className="hidden lg:flex relative w-full min-h-screen flex-row">
        {/* LEFT IMAGE */}
        <div
          className="w-2/3 h-screen bg-cover bg-center"
          style={{ backgroundImage: "url('/407 (1).png')" }}
        />

        {/* RIGHT IMAGE */}
        <div
          className="w-1/3 h-screen bg-fill bg-center"
          style={{ backgroundImage: "url('/office_location_background 1.png')" }}
        />

        {/* FORM CONTAINER */}
        <div
          className="
            absolute 
            left-2/3 top-1/2
            -translate-x-1/2 -translate-y-1/2
            w-[500px]
          "
        >
          <div className="bg-[#8C8C8CCC] backdrop-blur-md shadow-xl rounded-xl p-10 border border-gray-400">

            <h1 className="text-3xl font-semibold text-white mb-4">
              Welcome Back !
            </h1>

            <div className="w-full h-[1.5px] bg-white mb-3"></div>

            <p className="text-base text-gray-700">
              Access your Al Asmakh dashboard to view benefits, update details, and stay connected.
            </p>

            {/* Email */}
            <div className="mt-6">
              <label className="text-sm font-medium text-[#001730]">Email</label>
              <input
                type="email"
                placeholder="John Carter"
                className="mt-1 w-full p-2.5 rounded-md border border-gray-300"
              />
            </div>

            {/* Password */}
            <div className="mt-4">
              <label className="text-sm font-medium text-[#001730]">Password</label>
              <input
                type="password"
                placeholder="Please enter password here . ."
                className="mt-1 w-full p-2.5 rounded-md border border-gray-300"
              />
            </div>

            {/* Submit */}
            <button className="bg-[#001730] justify-between text-white px-6 py-2.5 mt-6 rounded-lg font-medium text-base hover:bg-[#002d52] transition-all duration-300 flex items-center gap-3 shadow-lg w-full">
              Submit
              <FaArrowRight size={18} className="ml-auto" />
            </button>

            <div className="mt-6 w-full h-[1px] bg-gray-300"></div>

            <p className="text-sm text-gray-700 mt-4 mb-3 text-center">
              Or Sign Up with
            </p>

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

            <div className="text-xs font-semibold mt-8 flex flex-row justify-between text-[#001730] gap-2 text-left">
              <span>
                Forgot Password - <a className="text-[#001730]">RESET</a>
              </span>

              <span>
                Do Not have an Account - <a className="text-[#001730]">SIGN UP</a>
              </span>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
