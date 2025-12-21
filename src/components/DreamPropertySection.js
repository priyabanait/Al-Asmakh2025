"use client";

import { FaArrowRight } from "react-icons/fa6";

export default function DreamPropertySection() {
  return (
    <section
      className="py-16 lg:py-20 relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url(/images/BG_Form.png)',
      }}
    >
      <div className="mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-12">
          {/* Left Content */}
          <div className="flex-1">
            <h2 className="text-[18px] lg:text-[24px] font-semibold text-[#001730] mb-2">
              Ready to Find Your Dream Property ?
            </h2>
            <div className="w-[50%] lg:w-[50%] h-[0.5px] bg-gray-300 my-2 lg:my-2"></div>
            <p className="text-sm lg:text-sm text-[#333333] leading-relaxed">
              Your dream property is just a click away. Whether you're looking for a new home, a strategic investment, or expert real estate advice.

              <br />
              Al Asmakh is here to assist you every step of the way. Take the first step towards your real estate goals and explore our available properties
              <br />
              or get in touch with our team for personalized assistance.
            </p>
          </div>

          <div className="flex-shrink-0 w-[20%]">
            <button className="bg-[#001730] w-[100%] text-white px-8 py-4 rounded-md font-medium text-[12px] lg:text-[12px] hover:bg-[#002d52] transition-all duration-300 flex items-center justify-between shadow-lg">
              <span>Contact Team</span>
              <FaArrowRight size={16} />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}

