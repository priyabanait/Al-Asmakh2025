"use client";
import { useState } from "react";
import { FaGoogle, FaMicrosoft, FaLinkedinIn } from "react-icons/fa";
import { RiArrowLeftLine } from "react-icons/ri";
import Link from "next/link";
import Image from "next/image";
import Footer from "../../components/Footer";
import { useRouter } from "next/navigation";
import { FiArrowRight } from "react-icons/fi";
import Header from "../../components/Header";
import { useAuth } from "../../contexts/AuthContext";
import { signInWithGoogle, signInWithMicrosoft, signInWithLinkedIn } from "../../utils/oauthService";

export default function SignupPage() {
  const router = useRouter();
  const { oauthLogin } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    email: "",
    phone: "",
    nationality: "Qatar", // Default nationality
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [oauthLoading, setOauthLoading] = useState({ google: false, microsoft: false, linkedin: false });
  const handleChange = (e) => {
    const { name, value } = e.target; 
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.secondName || !formData.email || 
        !formData.phone || !formData.password) {
      setError("All fields are required");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await fetch("https://albackend.x-360.ai/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Success
      setSuccess("Registration successful! Redirecting to dashboard...");
      localStorage.setItem("token", data.token);
      localStorage.setItem("userData", JSON.stringify(data.data));
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);

    } catch (err) {
      setError(err.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  // OAuth handlers
  const handleGoogleSignup = async () => {
    try {
      setOauthLoading(prev => ({ ...prev, google: true }));
      setError("");
      
      const token = await signInWithGoogle();
      await oauthLogin('google', token);
    } catch (err) {
      setError(err.message || "Google sign-up failed");
      setOauthLoading(prev => ({ ...prev, google: false }));
    }
  };

  const handleMicrosoftSignup = async () => {
    try {
      setOauthLoading(prev => ({ ...prev, microsoft: true }));
      setError("");
      
      const token = await signInWithMicrosoft();
      await oauthLogin('microsoft', token);
    } catch (err) {
      setError(err.message || "Microsoft sign-up failed");
      setOauthLoading(prev => ({ ...prev, microsoft: false }));
    }
  };

  const handleLinkedInSignup = () => {
    try {
      setOauthLoading(prev => ({ ...prev, linkedin: true }));
      setError("");
      
      signInWithLinkedIn();
      // LinkedIn uses redirect flow, so we don't wait for response
    } catch (err) {
      setError(err.message || "LinkedIn sign-up failed");
      setOauthLoading(prev => ({ ...prev, linkedin: false }));
    }
  };

  return (
    <>
      <div className="relative w-full min-h-screen">
        
        {/* Background Image */}
       
        <div
          className="fixed inset-0 w-full h-auto bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/Singup.png')`,
          }}
        />


<Header/>
        


        {/* Login Card - Positioned on Left */}
        <div className=" mb-24  mt-20 relative z-10 w-full flex justify-center items-center min-h-screen p-4 lg:p-8 lg:pl-16 md:left-56">
          <div  style={{borderRadius:"5px"}} className="bg-[#a0a6b0]/40  backdrop-blur-md  p-6 sm:p-10  w-full max-w-md lg:max-w-lg shadow-2xl  border border-white/10   ">

            {/* Title */}
            <h2 className="text-3xl font-bold text-white mb-3">Get Registered !</h2>

            <div className=" mb-5 h-0.5 mt-4 bg-gray-300 mx-auto "></div>

            <p style={{ color :"#001730"}} className=" text-sm mb-6">
              Register today and become part of Qatar's most rewarding real estate privilege community
            </p>

            {/* Error and Success Messages */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 mb-4 rounded" role="alert">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 mb-4 rounded" role="alert">
                {success}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm  font-semibold" style={{fontSize:'16px',      color: "#001730"}}>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full border  border-white/60 bg-white text-gray-800 px-4 py-2 mt-1 outline-none"
                  style={{borderRadius: "5px" , height:"35px"}}
                />
              </div>

              <div>
                <label className="text-sm  font-semibold" style={{fontSize:'16px', color: "#001730"}}>Last Name</label>
                <input
                  type="text"
                  name="secondName"
                  value={formData.secondName}
                  onChange={handleChange}
                  placeholder="Carter"
                  className="w-full border border-white/60 bg-white text-gray-800 px-4 py-2 mt-1 outline-none"
                  style={{borderRadius: "5px" , height:"35px"}}
                />
              </div>

              <div>
                <label className="text-sm font-semibold" style={{fontSize:'16px', color: "#001730"}}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Email here.."
                  className="w-full border border-white/60 bg-white text-gray-800 px-4 py-2 mt-1 outline-none"
                  style={{borderRadius: "5px" , height:"35px"}}
                />
              </div>

              <div>
                <label className="text-sm  font-semibold" style={{fontSize:'16px', color: "#001730"}}>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(123) 456-789"
                  className="w-full border border-white/60 bg-white text-gray-800 px-4 py-2 mt-1 outline-none"
                  style={{borderRadius: "5px" , height:"35px"}}
                />
              </div>
              <div>
                <label className="text-sm  font-semibold" style={{fontSize:'16px', color: "#001730"}}>Create Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Please type here..."
                  className="w-full border border-white/60 bg-white text-gray-800 px-4 py-2 mt-1 outline-none"
                  style={{borderRadius: "5px" , height:"35px"}}
                />
              </div>

              <div>
                <label className="text-sm  font-semibold" style={{fontSize:'16px',    color: "#001730"}}>Confirm Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Please type here..."
                  className="w-full border border-white/60 bg-white text-gray-800 px-4 py-2 mt-1 outline-none"
                  style={{borderRadius: "5px" , height:"35px"}}
                />
              </div>
            

              <div className="col-span-1 md:col-span-2 flex justify-center md:justify-start mt-4 sm:mt-6 md:mt-5 mb-4">
  <button
    type="submit"
    disabled={loading}
    style={{ borderRadius: "5px", fontSize: "12px" }}
    className="bg-[#0C1E35] hover:bg-[#132b47] w-full sm:w-auto min-w-[200px] md:w-44 text-white py-2 px-6 flex items-center justify-center md:justify-around gap-2 transition-all"
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

            {/* Divider */}
            <div className="border-t mt-12 w-72 border-white/50 my-4"></div>

            {/* Social Section */}
            <p className=" text-[#001730] text-sm mb-6">Or Sign Up with</p>

            <div className="flex gap-4 justify-center mb-6">
              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={oauthLoading.google || loading}
                className="w-28 h-10 border border-white/60 rounded-md flex justify-center items-center text-white cursor-pointer hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                title="Sign up with Google"
              >
                {oauthLoading.google ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FaGoogle className="text-black" />
                )}
              </button>
              <button
                type="button"
                onClick={handleMicrosoftSignup}
                disabled={oauthLoading.microsoft || loading}
                className="w-28 h-10 border border-white/60 rounded-md flex justify-center items-center text-white cursor-pointer hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                title="Sign up with Microsoft"
              >
                {oauthLoading.microsoft ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FaMicrosoft className="text-black" />
                )}
              </button>
              <button
                type="button"
                onClick={handleLinkedInSignup}
                disabled={oauthLoading.linkedin || loading}
                className="w-28 h-10 border border-white/60 rounded-md flex justify-center items-center text-white cursor-pointer hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                title="Sign up with LinkedIn"
              >
                {oauthLoading.linkedin ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FaLinkedinIn className="text-black" />
                )}
              </button>
            </div>

            {/* Bottom Links */}
            <div className="text-xs   mt-16 text-[#001730] flex justify-start font-semibold">
              <Link href="/login">
                <p className="cursor-pointer hover:underline">
                  Already have an Account - Sign In
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
