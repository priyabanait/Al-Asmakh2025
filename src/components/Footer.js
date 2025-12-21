"use client";

import { useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";
import { FaXTwitter, FaSnapchat, FaTiktok } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";
import { RiArrowRightLine } from "react-icons/ri";
import { useTranslation } from "../contexts/TranslationContext";

export default function Footer() {
  const { language } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const currentYear = new Date().getFullYear();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.trim()) {
      setMessage({ type: "error", text: "Please enter your email address" });
      alert("Please enter your email address");
      return;
    }
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email.trim())) {
      setMessage({ type: "error", text: "Please enter a valid email address" });
      alert("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const response = await fetch("https://albackend.x-360.ai/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setMessage({ type: "success", text: data.message || "Successfully subscribed to newsletter!" });
        alert(data.message || "Successfully subscribed to newsletter!");
        setEmail("");
      } else {
        setMessage({ type: "error", text: data.message || "Failed to subscribe. Please try again." });
        alert(data.message || "Failed to subscribe. Please try again.");
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      setMessage({ type: "error", text: "An error occurred. Please try again later." });
      alert("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer
      id="main-footer"
      className="bg-[#001730] text-white sm:py-5 w-full z-10 mt-auto flex-shrink-0 sm:px-0 md:px-0 3xl:px-0 4xl:px-0 5xl:px-0"
      style={{
        borderTopLeftRadius: "0px",
        borderTopRightRadius: "0px",
        width: "100%",
      }}
    >
      <div className="w-full px-4 mt-0 sm:px-5 md:px-6 3xl:px-8 4xl:px-12 5xl:px-12 mx-auto space-y-4 sm:space-y-5 md:space-y-6">
        {/* Logo + top row */}
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-700 pb-4 sm:pb-5 md:pb-5 gap-4 sm:gap-5">
          <Link href="/" className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 cursor-pointer px-6 py-3 md:px-0 md:py-0">
            <Image
              src="/images/w-alasmakh.png"
              alt="Al-Asmakh Logo"
              width={100}
              height={150}
              className="object-contain cursor-pointer w-32 sm:w-36 md:w-[180px] 3xl:w-[180px] 4xl:w-[200px] 5xl:w-[220px]"
              onError={(e) => {
                if (language === 'ar') e.target.src = "/New_img/asmakh.png";
              }}
            />
          </Link>
        </div>

        {/* Social + Newsletter */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-5 sm:gap-6 w-full">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 5xl:gap-5 text-[8px] sm:text-[9px] 5xl:text-[11px] justify-center md:justify-start">
            <p className="hidden md:block text-[14px] text-start">Follow Us</p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-3">
              {/* icons ... */}
              <a href="https://www.youtube.com/@alasmakhrealestatedevelopm6191" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <FaYoutube className="hover:text-gray-400 cursor-pointer w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 transition-colors" />
              </a>
              <a href="https://www.facebook.com/alasmakhrealestatedc" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebookF className="hover:text-gray-400 cursor-pointer w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 transition-colors" />
              </a>
              <a href="https://www.instagram.com/alasmakhrealestate/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram className="hover:text-gray-400 cursor-pointer w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 transition-colors" />
              </a>
              <a href="https://x.com/alasmakh" target="_blank" rel="noopener noreferrer" aria-label="Twitter/X">
                <FaXTwitter className="hover:text-gray-400 cursor-pointer w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 transition-colors" />
              </a>
              <a href="https://www.linkedin.com/company/al-asmakh-real-estate?_l=en_US" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedinIn className="hover:text-gray-400 cursor-pointer w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 transition-colors" />
              </a>
              <a href="https://www.snapchat.com/@alasmakh.qa" target="_blank" rel="noopener noreferrer" aria-label="Snapchat">
                <FaSnapchat className="hover:text-gray-400 cursor-pointer w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 transition-colors" />
              </a>
              <a href="https://www.tiktok.com/@alasmakh_real_estate" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <FaTiktok className="hover:text-gray-400 cursor-pointer w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 transition-colors" />
              </a>
            </div>
          </div>

          <form onSubmit={handleSubscribe} className="hidden md:flex flex-col gap-2 w-full sm:w-[300px] md:w-[520px] md:ms-auto 3xl:w-[650px] 4xl:w-[750px] 5xl:w-[900px]">
            <div style={{ borderRadius: "5px" }} className="flex flex-row items-center bg-white shadow-md overflow-hidden rounded-md h-[36px] sm:h-[38px] md:h-[40px]">
              <div className="flex items-center px-2 sm:px-4 md:px-5 5xl:px-6 bg-transparent flex-shrink-0">
                <span className="text-gray-800  uppercase text-[8px] sm:text-[9px] md:text-[10px]">Newsletter</span>
                <div className="hidden sm:block h-4 w-px bg-gray-600 mx-3"></div>
              </div>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your Email here..."
                disabled={loading}
                className="flex-1 px-2 sm:px-4 5xl:px-6 py-1 outline-none text-[#181717] text-[12px] border-none min-w-0 placeholder:text-gray-400 disabled:opacity-50"
              />

<button
  type="submit"
  disabled={loading}
  style={{ backgroundColor: "#001730" }}
  className="py-1 px-4 mr-2 text-white 
  text-[12px] 
    rounded-md flex items-center justify-between 
    h-[26px] w-[150px] 
    disabled:opacity-50 disabled:cursor-not-allowed"
>
  <span>{loading ? "Subscribing..." : "Subscribe"}</span>
  <RiArrowRightLine className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
</button>

            </div>
            {message.text && (
              <div className={`text-[10px] sm:text-[11px] px-2 py-1 rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {message.text}
              </div>
            )}
          </form>
        </div>

        {/* Desktop Footer Section */}
        <div className="hidden md:flex flex-row justify-between items-center text-gray-300 gap-4 sm:gap-6 border-t border-gray-700 pt-4 mt-0">
          <div className="text-start w-full md:w-auto">
            <p className="text-[8px] sm:text-[9px] md:text-[10px] leading-relaxed">
              Address: Floor 28, Majlis Al Taawon Street, West Bay, P.O. Box 15068, Doha, State of Qatar.
              &nbsp; <Link href="/privacy-policy" className="hover:text-white underline">Privacy Policy</Link> &nbsp; | &nbsp; <Link href="/terms" className="hover:text-white underline">Terms and Conditions</Link>
              <br />
              Copyright © {currentYear} Al Asmakh Real Estate
            </p>
          </div>

          <div className="flex flex-col items-center gap-0">
            <div className="flex items-center gap-2 md:gap-2 justify-center">
              <div className="w-14 h-14 md:w-[50px] md:h-[50px]">
                <Image src="/images/act.png" alt="ACT Logo" width={50} height={50} className="object-contain w-full h-full" />
              </div>
              <div className="w-14 h-14 md:w-[50px] md:h-[50px]">
                <Image src="/images/ukas.png" alt="UKAS Logo" width={40} height={40} className="object-contain w-full h-full" />
              </div>
            </div>
            <p className="text-[13px] sm:text-[9px] md:text-[13px] text-gray-300 text-center">Regulated by RICS</p>
          </div>
        </div>

        {/* Mobile Footer Section */}
        <div className="md:hidden text-center text-gray-300 border-t border-gray-700 pt-4 mt-4">
          <div className="flex flex-col items-center gap-2 sm:gap-2 mb-6">
            <div className="flex items-center justify-center gap-2 sm:gap-10 flex-wrap">
              <div className="w-[50px] h-[50px] sm:w-20 sm:h-20">
                <Image src="/images/act.png" alt="ACT Logo" width={50} height={50} className="object-contain w-full h-full" />
              </div>
              <div className="w-[50px] h-[50px] sm:w-20 sm:h-20">
                <Image src="/images/ukas.png" alt="UKAS Logo" width={50} height={50} className="object-contain w-full h-full" />
              </div>
            </div>
            <p className="text-[8px] sm:text-[10px] text-gray-300 text-center">Regulated by RICS</p>
          </div>

          <p className="text-[9px] sm:text-[10px] leading-relaxed">
            Address: Floor 28, Majlis Al Taawon Street, West Bay, P.O. Box 15068, Doha,
            <br />
            State of Qatar. &nbsp; <Link href="/privacy-policy" className="hover:text-white underline">Privacy Policy</Link> &nbsp; | &nbsp; <Link href="/terms" className="hover:text-white underline">Terms and Conditions</Link>
            <br />
            Copyright © {currentYear} Al Asmakh Real Estate
          </p>
        </div>
      </div>
    </footer>
  );
}