'use client'

import { useState } from 'react'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { FaMapMarkerAlt, FaBriefcase, FaClock, FaArrowRight } from 'react-icons/fa'
import DreamPropertySection from '../../../components/DreamPropertySection'
export default function CareerPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const jobCategories = ['All', 'Sales', 'Marketing', 'Property Management', 'Development', 'Administration']

  const jobListings = [
    {
      id: 1,
      title: 'Senior Real Estate Sales Agent',
      category: 'Sales',
      location: 'Doha, Qatar',
      type: 'Full-time',
      experience: '3+ years',
      description: 'We are seeking an experienced real estate sales agent to join our dynamic team. The ideal candidate will have a proven track record in property sales and excellent communication skills.',
      requirements: [
        'Minimum 3 years of real estate sales experience',
        'Strong negotiation and communication skills',
        'Valid real estate license',
        'Knowledge of Qatar real estate market'
      ],
      postedDate: '2024-01-15'
    },
    {
      id: 2,
      title: 'Property Marketing Specialist',
      category: 'Marketing',
      location: 'West Bay, Qatar',
      type: 'Full-time',
      experience: '2+ years',
      description: 'Join our marketing team to create compelling property listings and marketing campaigns. You will work closely with sales teams to promote properties across various channels.',
      requirements: [
        '2+ years of marketing experience',
        'Experience with digital marketing and social media',
        'Strong creative and writing skills',
        'Knowledge of real estate marketing preferred'
      ],
      postedDate: '2024-01-12'
    },
    {
      id: 3,
      title: 'Property Manager',
      category: 'Property Management',
      location: 'Lusail, Qatar',
      type: 'Full-time',
      experience: '4+ years',
      description: 'We are looking for an experienced property manager to oversee a portfolio of residential and commercial properties. You will be responsible for tenant relations, maintenance, and financial management.',
      requirements: [
        '4+ years of property management experience',
        'Strong organizational and problem-solving skills',
        'Excellent communication abilities',
        'Knowledge of property laws and regulations'
      ],
      postedDate: '2024-01-10'
    },
    {
      id: 4,
      title: 'Project Development Coordinator',
      category: 'Development',
      location: 'Doha, Qatar',
      type: 'Full-time',
      experience: '3+ years',
      description: 'Support our development team in managing construction projects from planning to completion. Coordinate with contractors, suppliers, and stakeholders to ensure successful project delivery.',
      requirements: [
        '3+ years in construction or project management',
        'Strong coordination and multitasking skills',
        'Knowledge of construction processes',
        'Bachelor\'s degree in related field'
      ],
      postedDate: '2024-01-08'
    },
    {
      id: 5,
      title: 'Real Estate Sales Agent',
      category: 'Sales',
      location: 'Pearl Qatar, Qatar',
      type: 'Full-time',
      experience: '1+ years',
      description: 'Entry-level position for motivated individuals looking to start a career in real estate sales. We provide comprehensive training and support to help you succeed.',
      requirements: [
        '1+ years of sales experience (any industry)',
        'Strong interpersonal skills',
        'Willingness to learn and grow',
        'Valid driver\'s license'
      ],
      postedDate: '2024-01-05'
    },
    {
      id: 6,
      title: 'Administrative Assistant',
      category: 'Administration',
      location: 'Doha, Qatar',
      type: 'Full-time',
      experience: '2+ years',
      description: 'Support our office operations with administrative tasks including document management, client communication, and coordination between departments.',
      requirements: [
        '2+ years of administrative experience',
        'Proficiency in Microsoft Office',
        'Strong organizational skills',
        'Excellent communication abilities'
      ],
      postedDate: '2024-01-03'
    },
    {
      id: 7,
      title: 'Digital Marketing Manager',
      category: 'Marketing',
      location: 'Doha, Qatar',
      type: 'Full-time',
      experience: '5+ years',
      description: 'Lead our digital marketing efforts including SEO, social media, content marketing, and online advertising. Develop and execute comprehensive digital marketing strategies.',
      requirements: [
        '5+ years of digital marketing experience',
        'Strong analytical and strategic thinking',
        'Experience with marketing automation tools',
        'Proven track record of successful campaigns'
      ],
      postedDate: '2024-01-01'
    },
    {
      id: 8,
      title: 'Facilities Management Coordinator',
      category: 'Property Management',
      location: 'West Bay, Qatar',
      type: 'Full-time',
      experience: '3+ years',
      description: 'Coordinate facilities management services for commercial and residential properties. Ensure optimal building operations and maintenance standards.',
      requirements: [
        '3+ years in facilities management',
        'Knowledge of building systems and maintenance',
        'Strong coordination skills',
        'Attention to detail'
      ],
      postedDate: '2023-12-28'
    }
  ]

  const filteredJobs = selectedCategory === 'All' 
    ? jobListings 
    : jobListings.filter(job => job.category === selectedCategory)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <main className="min-h-screen relative bg-gray-50">
      <Header />
      
   
       {/* Hero Section */}
       <section
        className="relative w-full bg-cover bg-center bg-no-repeat py-20 md:py-32"
        style={{ backgroundImage: "url('/services/Faq.jpg')" }}
      >
        <div className="absolute inset-0 bg-white/70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center" >
            <div className="lg:mt-16 lg:mb-16 mt-8 mb-8">
              <h1
                className="text-[#10284C] uppercase mb-2 md:mb-3 lg:mb-4 px-2 sm:px-4"
                style={{
                  fontSize: "clamp(18px, 3.5vw, 23px)",
                  whiteSpace: "nowrap"
                }}
              >
                Career Opportunities
              </h1>

              <div
                className={`w-32 lg:w-40 mt-2 3xl:mt-5 4xl:mt-6 h-[0.5px] bg-gray-300 mx-auto mb-4 3xl:mb-8 4xl:mb-10 transition-all duration-1000 delay-200 opacity-100 scale-x-100'
                }`}
              ></div>

              <p
                style={{ fontSize: "clamp(13px, 0.8vw, 17px)", color: "#919191" }}
                className="mb-7"
              >
                Join our team and build your career in Qatar's leading real estate company
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* Category Filter */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
            {jobCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-[#001730] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No job openings found in this category.</p>
            <p className="text-gray-500 mt-2">Please check back later or try a different category.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-6 md:p-8">
                  {/* Job Header */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-bold text-[#001730] mb-2">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaBriefcase className="w-4 h-4" />
                          <span>{job.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaClock className="w-4 h-4" />
                          <span>{job.experience}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start md:items-end gap-2">
                      <span className="px-3 py-1 bg-[#001730] text-white text-sm font-medium rounded-full">
                        {job.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        Posted: {formatDate(job.postedDate)}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Requirements */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-[#001730] mb-3">Requirements:</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="text-sm md:text-base">{req}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Apply Button */}
                  <div className="flex justify-end">
                    <a
                      href="/contact"
                      className="inline-flex items-center gap-2 bg-[#001730] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#003366] transition-colors duration-200"
                    >
                      Apply Now
                      <FaArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

<DreamPropertySection 
        title="Don't see a position that matches your skills?"
        description="We're always looking for talented individuals to join our team. Send us your resume and we'll keep you in mind for future opportunities."
        btnText="Submit Your Resume"
        btnLink="/contact"
      />

      <Footer />
    </main>
  )
}
