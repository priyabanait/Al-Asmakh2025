"use client";

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import servicesData from '../../data/servicesData.json'

export default function OtherServicesPage() {
  const services = servicesData.services || [];

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      {/* Hero / Intro */}
      <section className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden bg-[#F5F7FA]">
        <div className="absolute inset-0">
          <Image
            src="/images_pages/services lease.png"
            alt="Our Services"
            fill
            className="object-cover opacity-70"
          />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 text-center lg:text-left">
          <div className="glass-effect rounded-md px-6 py-8 lg:px-10 lg:py-10 shadow-xl bg-white/80">
            <h1 className="heading text-[#001730] mb-3">
              A CLEAR OVERVIEW OF OUR CORE SERVICES
            </h1>
            <div className="w-[40%] h-[1px] bg-gray-300 mb-4 mx-auto lg:mx-0"></div>
            <p className="subheading text-gray-700">
              Whether you're buying, selling, leasing, investing, or managing property, Al Asmakh Real Estate
              offers specialised service lines that work together to create a complete real estate solution.
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview Grid */}
      <section className="w-full bg-white py-12 lg:py-16">
        <div className="max-w-6xl mx-auto px-4 lg:px-0">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-semibold text-[#001730] mb-2">
              Explore Our Service Lines
            </h2>
            <div className="w-[30%] h-[0.5px] bg-gray-300 mx-auto mb-3"></div>
            <p className="subheading text-gray-600 max-w-3xl mx-auto">
              Choose the area you want to learn more about, then dive into a dedicated page with details,
              case studies, and tailored next steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link key={service.id} href={service.path} className="group">
                <div className="bg-[#F5F7FA] rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col">
                  <div className="relative w-full h-40">
                    <Image
                      src={service.backgroundImage || '/images_pages/services lease.png'}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-[#001730] font-semibold text-lg mb-2 whitespace-pre-line">
                      {service.title}
                    </h3>
                    <p className="subheading text-gray-600 text-sm mb-3 line-clamp-3">
                      {service.description}
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1 mb-4">
                      {service.stats.slice(0, 2).map((stat, idx) => (
                        <li key={idx}>
                          <span className="font-semibold text-[#001730]">{stat.value}</span>{' '}
                          <span>{stat.label}</span>
                        </li>
                      ))}
                    </ul>
                    <span className="mt-auto inline-flex items-center text-[#001730] text-sm font-medium group-hover:underline">
                      Learn more
                      <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">
                        →
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main> 
  )
}
