"use client";
import { useState } from "react";
import { FaGoogle, FaMicrosoft, FaLinkedinIn } from "react-icons/fa";
import Link from "next/link";
import Footer from "../../components/Footer";
import { useRouter } from "next/navigation";
import { FiArrowRight } from "react-icons/fi";
import { RiArrowLeftLine } from "react-icons/ri";
import Image from "next/image";
import Header from "../../components/Header";


// https://albackend.x-360.ai
export default function PartnerSignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    partnershipId: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.phoneNumber || 
        !formData.partnershipId || !formData.password || !formData.confirmPassword) {
      setError("All fields are required");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
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
      const response = await fetch("https://albackend.x-360.ai/api/partners/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          partnershipId: formData.partnershipId,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Success
      setSuccess("Registration successful!");
      localStorage.setItem("token", data.token);
      router.push("/partner-dashboard");

      
      // Redirect after a short delay
      setTimeout(() => {
        router.push("/partner-login");
      }, 2000);

    } catch (err) {
      setError(err.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative w-full min-h-screen">
        
        {/* Background Image */}
       
        <div
          className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/Partner-log.png')`,
          }}
        />

        <Header/>
        {/* Glass Overlay */}
        {/* <div className="absolute inset-0 bg-black/20"></div> */}

    

        {/* Login Card - Positioned on Left */}
        <div className=" mb-24  mt-20 relative z-10 w-full flex justify-center items-center min-h-screen p-4 lg:p-8 lg:pl-16 md:left-56">
          <div  style={{borderRadius:"5px"}} className="bg-[#E0E0E0]/40  backdrop-blur-md  p-6 sm:p-10  w-full max-w-md lg:max-w-lg shadow-2xl  border border-white/10   ">

            {/* Title */}
            <h2 className="text-3xl font-bold text-white mb-3">Partner Registration !</h2>

            <div className=" mb-2 h-[0.3px] mt-5 bg-gray-300 mx-auto "></div>

            <p style={{ color :"#001730"}} className=" text-sm mb-2">
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
                <label className="text-sm  font-semibold" style={{fontSize:'16px', color: "#001730"}}>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Carter"
                  className="w-full border  border-white/60 bg-white text-gray-800 px-4 py-2 mt-1 outline-none"
                  style={{borderRadius: "5px" , fontSize: '12px' , height:"35px"}}
                />
              </div>

              <div>
                <label className="text-sm  font-semibold" style={{fontSize:'16px', color: "#001730"}}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Email here.."
                  className="w-full border border-white/60 bg-white text-gray-800 px-4 py-2 mt-1 outline-none"
                  style={{borderRadius: "5px" , height:"35px", fontSize: '12px'}}
                />
              </div>

              <div>
                <label className="text-sm font-semibold" style={{fontSize:'16px', color: "#001730"}}>Phone</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="(123) 456-789"
                  className="w-full border border-white/60 bg-white text-gray-800 px-4 py-2 mt-1 outline-none"
                  style={{borderRadius: "5px" , height:"35px", fontSize: '12px'}}
                />
              </div>


              <div>
                <label className="text-sm  font-semibold" style={{fontSize:'16px',    color: "#001730"}}>Partnership ID</label>
                <input
                  type="text"
                  name="partnershipId"
                  value={formData.partnershipId}
                  onChange={handleChange}
                  placeholder="DF-108-77890"
                  className="w-full border border-white/60 bg-white text-gray-800 px-4 py-2 mt-1 outline-none"
                  style={{borderRadius: "5px" , height:"35px", fontSize: '12px'}}
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
                  style={{borderRadius: "5px" , height:"35px", fontSize: '12px' }}
                />
              </div>


              
              <div>
                <label className="text-sm  font-semibold" style={{fontSize:'16px', color: "#001730"}}>Re Type Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Please type here..."
                  className="w-full border border-white/60 bg-white text-gray-800 px-4 py-2 mt-1 outline-none"
                  style={{borderRadius: "5px" , height:"35px", fontSize: '12px' }}
                />
              </div>
            

              <div className="col-span-1 md:col-span-2 flex justify-center md:justify-start mt-4 sm:mt-6 md:mt-12 mb-4">
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
            {/* <div className="border-t mt-12 w-72 border-white/50 my-4"></div> */}

            {/* Social Section */}
            {/* <p className=" text-[#001730] text-sm mb-6">Or Sign Up with</p>

            <div className="flex gap-4 justify-center mb-6">
              <div className="  w-28  h-10 border border-white/60 rounded-md flex justify-center items-center text-white cursor-pointer hover:bg-white/20">
                <FaGoogle className="text-black" />
              </div>
              <div className="  w-28  h-10 border border-white/60 rounded-md flex justify-center items-center text-white cursor-pointer hover:bg-white/20">
                <FaMicrosoft className="text-black" />
              </div>
              <div className="   w-28 h-10 border border-white/60 rounded-md flex justify-center items-center text-white cursor-pointer hover:bg-white/20">
                <FaLinkedinIn className="text-black" />
              </div>
            </div> */}

            {/* Bottom Links */}
            <div className="text-[12px]   mt-16 text-[#001730] flex justify-start font-semibold">
              <Link href="/partner-login">
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