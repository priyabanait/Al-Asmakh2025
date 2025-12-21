"use client";
import { useState, useEffect } from "react";
import { FaGoogle, FaMicrosoft, FaLinkedinIn } from "react-icons/fa";
import { RiArrowLeftLine } from "react-icons/ri";
import Link from "next/link";
import Image from "next/image";
import Footer from "../../components/Footer";
import { useAuth } from "../../contexts/AuthContext";
import { FiArrowRight } from "react-icons/fi";
import Header from "../../components/Header";
import { signInWithGoogle, signInWithMicrosoft, signInWithLinkedIn } from "../../utils/oauthService";

export default function LoginPage() {
  const { login, oauthLogin, isAuthenticated, isPartner } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState({ google: false, microsoft: false, linkedin: false });
  
  // // Check if user is already logged in
  // useEffect(() => {
  //   if (typeof window !== 'undefined' && isAuthenticated()) {
  //     if (isPartner()) {
  //       window.location.href = "/partner-dashboard";
  //     } else {
  //       window.location.href = "/dashboard";
  //     }
  //   }
  // }, [isAuthenticated, isPartner]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Please provide both email and password");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    try {
      setLoading(true);
      // Use the login function from auth context
      await login(formData, false);
      // Redirect is handled in the login function
    } catch (err) {
      setError(err.message || "An error occurred during login");
      setLoading(false);
    }
  };

  // OAuth handlers
  const handleGoogleLogin = async () => {
    try {
      setOauthLoading(prev => ({ ...prev, google: true }));
      setError("");
      
      const token = await signInWithGoogle();
      await oauthLogin('google', token);
    } catch (err) {
      setError(err.message || "Google sign-in failed");
      setOauthLoading(prev => ({ ...prev, google: false }));
    }
  };

  const handleMicrosoftLogin = async () => {
    try {
      setOauthLoading(prev => ({ ...prev, microsoft: true }));
      setError("");
      
      const token = await signInWithMicrosoft();
      await oauthLogin('microsoft', token);
    } catch (err) {
      setError(err.message || "Microsoft sign-in failed");
      setOauthLoading(prev => ({ ...prev, microsoft: false }));
    }
  };

  const handleLinkedInLogin = () => {
    try {
      setOauthLoading(prev => ({ ...prev, linkedin: true }));
      setError("");
      
      signInWithLinkedIn();
      // LinkedIn uses redirect flow, so we don't wait for response
    } catch (err) {
      setError(err.message || "LinkedIn sign-in failed");
      setOauthLoading(prev => ({ ...prev, linkedin: false }));
    }
  };

  return (
    <>
      <div className="relative w-full min-h-screen">
        

      <Header/>
       
        <div
          className="fixed inset-0 w-full h-auto bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/Login.png')`,
          }}
        />
        {/* Glass Overlay */}
        {/* <div className="absolute inset-0 bg-black/20"></div> */}

  

        {/* Login Card - Positioned on Left */}
        <div className=" relative z-10 w-full  mb-24  mt-20 flex justify-center items-center min-h-screen p-4 lg:p-8 lg:pl-16 md:left-56">
          <div style={{borderRadius:"5px"}} className="bg-black/20 backdrop-blur-md p-6 sm:p-10 w-full max-w-md lg:max-w-lg shadow-2xl border border-white/10">

            {/* Title */}
            <h2 className="text-3xl font-bold text-white mb-3">Welcome Back !</h2>

            <div className=" mb-2  h-[0.5px] mt-2 bg-white  w-64 "></div>

            <p style={{ color:"#001730", fontSize:'12px'}} className="mb-6">
              Access your Privilege Program dashboard to view benefits, update details, and stay connected.
            </p>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 mb-4 rounded" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-4">
              <div>
                <label style={{fontSize:'16px'}} className="text-[#001730]  text-semibold">Email</label>
                <br/>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Email here.."
                  className="w-full border border-white/60 bg-white text-gray-800 rounded-md px-4 py-2 mt-1 outline-none"
                  style={{borderRadius: "5px", width:"80%", height:"40px", fontSize:'14px'}}
                />
              </div>

              <div>
                <label style={{fontSize:'16px'}} className="text-[#001730]  text-semibold">Password</label>
                <br/>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Please enter password here.."
                  className="w-full border border-white/60 bg-white font-semibold text-gray-800 rounded-md px-4 py-2 mt-1 outline-none"
                  style={{borderRadius: "5px", width:"80%", height:"40px", fontSize:'14px'}}
                />
              </div>

              {/* Submit Button */}
              {/* <button 
                type="submit"
                disabled={loading}
                style={{borderRadius: "5px", fontSize: '12px'}} 
                className="bg-[#0C1E35] hover:bg-[#132b47] w-full md:w-44 text-white py-2 mt-7 flex justify-around items-center gap-3 mb-4"
              >
                {loading ? "Processing..." : "Submit"}
                {!loading && <span className="text-sm leading-none">➜</span>}
              </button> */}
<div className="col-span-1 md:col-span-2 flex justify-start md:justify-start mt-4 sm:mt-6 md:mt-5 mb-4">
  <button
    type="submit"
    disabled={loading}
    style={{ borderRadius: "5px", fontSize: "12px" }}
    className="bg-[#0C1E35] hover:bg-[#132b47] 
               w-[140px] sm:w-[160px] md:w-44 
               text-white py-2 px-4 
               flex items-center justify-center md:justify-around 
               gap-2 transition-all"
  >
    {loading ? (
      "Processing..."
    ) : (
      <>
        Submit
        <FiArrowRight className="text-sm md:text-base shrink-0" />
      </>
    )}
  </button>
</div>

              
            </form>

            {/* Social Section */}
            <p className="text-[#001730] text-sm mt-5 mb-2">Or Sign In with</p>

            <div className="flex gap-4 justify-center mb-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={oauthLoading.google || loading}
                className="w-28 h-10 border border-white/60 rounded-md flex justify-center items-center text-white cursor-pointer hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                title="Sign in with Google"
              >
                {oauthLoading.google ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FaGoogle className="text-black" />
                )}
              </button>
              <button
                type="button"
                onClick={handleMicrosoftLogin}
                disabled={oauthLoading.microsoft || loading}
                className="w-28 h-10 border border-white/60 rounded-md flex justify-center items-center text-white cursor-pointer hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                title="Sign in with Microsoft"
              >
                {oauthLoading.microsoft ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FaMicrosoft className="text-black" />
                )}
              </button>
              <button
                type="button"
                onClick={handleLinkedInLogin}
                disabled={oauthLoading.linkedin || loading}
                className="w-28 h-10 border border-white/60 rounded-md flex justify-center items-center text-white cursor-pointer hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                title="Sign in with LinkedIn"
              >
                {oauthLoading.linkedin ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FaLinkedinIn className="text-black" />
                )}
              </button>
            </div>

            {/* Bottom Links */}
            <div className="text-xs text-black flex   mt-20 justify-between">
              <p className="cursor-pointer hover:underline">
                Forgot Password - RESET
              </p>
              <Link href="/signup">
                <p className="cursor-pointer hover:underline">
                  Do Not have an Account - SIGN UP
                </p>
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Footer - positioned below the main content */}
      <div className="relative z-20">
        <Footer/>   
      </div>
    </>
  );
}