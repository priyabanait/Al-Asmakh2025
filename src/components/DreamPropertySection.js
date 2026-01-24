"use client";

import { FaArrowRight } from "react-icons/fa6";
import Link from "next/link";

export default function DreamPropertySection({
  title = "Ready to Find Your Dream Property ?",
  description = "Your dream property is just a click away. Whether you're looking for a new home, a strategic investment, or expert real estate advice.\n\nAl Asmakh is here to assist you every step of the way. Take the first step towards your real estate goals and explore our available properties or get in touch with our team for personalized assistance.",
  btnText = "Contact Team",
  btnLink = "/contact"
}) {
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
            <h2 className="text-[16px] lg:text-[24px] font-semibold text-[#001730] mb-2">
              {title}
            </h2>
            <div className="w-[50%] lg:w-[50%] h-[0.5px] bg-gray-300 my-2 lg:my-2"></div>
            <p className="text-xs lg:text-sm text-[#333333] leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>

          <div className="flex-shrink-0 w-full lg:w-[20%]">
            {btnLink ? (
              <Link href={btnLink}>
                <button className="bg-[#001730] w-full text-white px-8 py-4 rounded-md font-medium text-[12px] lg:text-[12px] hover:bg-[#002d52] transition-all duration-300 flex items-center justify-between shadow-lg">
                  <span>{btnText}</span>
                  <FaArrowRight size={16} />
                </button>
              </Link>
            ) : (
              <button className="bg-[#001730] w-full text-white px-8 py-4 rounded-md font-medium text-[12px] lg:text-[12px] hover:bg-[#002d52] transition-all duration-300 flex items-center justify-between shadow-lg">
                <span>{btnText}</span>
                <FaArrowRight size={16} />
              </button>
            )}
          </div>


        </div>
      </div>
    </section>
  );
}

