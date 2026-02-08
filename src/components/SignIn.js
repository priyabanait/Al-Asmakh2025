'use client'

import { useState } from 'react'
import { RiArrowRightLine } from 'react-icons/ri';
import Link from 'next/link';

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle sign in logic here
    console.log('Sign in data:', formData);
  };

  return (
    <section className="py-4 3xl:py-8 4xl:py-12" style={{backgroundColor: ' #F9F9F9;'}}>
      <div className="container-custom">
        <div className="flex flex-wrap justify-around items-start gap-12 3xl:gap-16 4xl:gap-20">
          
          {/* User Sign In Section */}
          <div className="text-center mt-5 3xl:mt-8 4xl:mt-10 flex-1 min-w-[300px] 3xl:min-w-[350px] 4xl:min-w-[400px] max-w-[400px] 3xl:max-w-[450px] 4xl:max-w-[500px]">
            <h2 style={{fontSize: 'clamp(25px, 2vw, 36px)'}} className="md:font-bold mb-4 3xl:mb-6 4xl:mb-8">
            SIGN IN

            </h2>
            
            {/* Horizontal line divider */}
            <div className="w-32 3xl:w-40 4xl:w-48 h-[0.5px] bg-gray-300 mx-auto mb-5 3xl:mb-6 4xl:mb-8"></div>
            
            <p style={{fontSize: 'clamp(12px, 0.9vw, 16px)',  color:"#9795B5"}} className="mb-6 3xl:mb-8 4xl:mb-10">
              Securely log in to your Privilege Program dashboard and manage your profile with ease.
            </p>
            
            <Link href="/partner-login">
              <button style={{backgroundColor: "#001730", width :"clamp(200px, 15vw, 280px)", borderRadius :"5px", fontSize:"clamp(11px, 0.9vw, 15px)", height: "clamp(35px, 3vw, 45px)"}} className="px-4 3xl:px-6 4xl:px-8 py-2 3xl:py-2.5 4xl:py-3 w-60 3xl:w-72 4xl:w-80 text-white hover:bg-gray-800 transition flex items-center justify-between gap-2 text mx-auto md:mt-10 3xl:mt-12 4xl:mt-14">
                Sign In
                <RiArrowRightLine className="inline-block" />
              </button>
            </Link>

            <Link href="/partner-signup">
              <p style={{fontSize: 'clamp(10px, 0.8vw, 14px)', color:"#9795B5"}} className="text-gray-600 mt-4 3xl:mt-6 4xl:mt-8 cursor-pointer hover:underline">
                Don't have an Account - 
                <span style={{color: "#001730"}}>
                  Sign up

                </span>
     
              </p>
            </Link>
            <div className="w-32 3xl:w-40 4xl:w-48 h-[0.5px] mt-4 3xl:mt-6 4xl:mt-8 bg-gray-300 mx-auto mb-6 3xl:mb-8 4xl:mb-10"></div>

<Link href="/partner-login">  



              <h2  style={{fontSize: 'clamp(12px, 1vw, 18px)' ,   color:"#001730"}} className="md:text-2xl font-semibold mb-6 3xl:mb-8 4xl:mb-10">
                Partner Log in
              </h2>

              </Link>
{/* 
            <Link href="/partner-signup">
              <button className="px-8 py-3 w-60 bg-black text-white rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2 mx-auto">
                Partner Sign Up
                <RiArrowRightLine className="inline-block" />
              </button>
            </Link> */}

           
          </div>

  

        </div>
      </div>
    </section>
  )
}
