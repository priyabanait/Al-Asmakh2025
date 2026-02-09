'use client'

import { useState } from 'react'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqCategories = [
    {
      title: 'General Questions',
      questions: [
        {
          question: 'What services does Al-Asmakh Real Estate offer?',
          answer: 'Al-Asmakh Real Estate offers comprehensive real estate services including property sales, leasing, property management, project development, marketing, facilities management, and agent services. We provide end-to-end solutions for all your real estate needs.'
        },
        {
          question: 'How can I contact Al-Asmakh Real Estate?',
          answer: 'You can contact us through our website contact form, call our head office, or visit one of our agent offices. Our team is available to assist you with any inquiries about properties, services, or partnerships.'
        },
        {
          question: 'Do you offer property viewing services?',
          answer: 'Yes, we offer professional property viewing services. You can schedule a viewing through our website or by contacting our sales team. We ensure all viewings are conducted safely and professionally.'
        },
        {
          question: 'What areas does Al-Asmakh Real Estate cover?',
          answer: 'We operate across Qatar, with a strong presence in key areas including Doha, Lusail, West Bay, Pearl Qatar, and Al Waab. Our extensive network allows us to serve clients throughout the country.'
        }
      ]
    },
    {
      title: 'Property Sales & Leasing',
      questions: [
        {
          question: 'How do I list my property for sale or rent?',
          answer: 'To list your property, you can contact our sales team through the website or visit our office. We will conduct a property valuation, take professional photos, and create a comprehensive listing to maximize your property\'s visibility.'
        },
        {
          question: 'What documents do I need to buy a property?',
          answer: 'Required documents typically include a valid ID, proof of income, bank statements, and any relevant permits. Our team will guide you through the complete documentation process to ensure a smooth transaction.'
        },
        {
          question: 'How long does the property sale process take?',
          answer: 'The average property sale process takes approximately 30 days from listing to closing. However, this can vary depending on property type, market conditions, and buyer financing. Our team works efficiently to expedite the process.'
        },
        {
          question: 'Do you provide property valuation services?',
          answer: 'Yes, we offer professional property valuation services based on current market conditions, comparable properties, and property features. Our valuations help you make informed decisions about pricing your property.'
        }
      ]
    },
    {
      title: 'Property Management',
      questions: [
        {
          question: 'What does property management include?',
          answer: 'Our property management services include tenant screening, rent collection, maintenance coordination, property inspections, financial reporting, and handling tenant relations. We ensure your property is well-maintained and profitable.'
        },
        {
          question: 'How much do property management services cost?',
          answer: 'Property management fees vary based on the services required and property type. We offer flexible packages tailored to your needs. Contact us for a detailed quote based on your specific requirements.'
        },
        {
          question: 'Do you handle property maintenance?',
          answer: 'Yes, we coordinate all property maintenance including routine inspections, repairs, and emergency services. We have a network of trusted contractors and service providers to ensure timely and quality maintenance.'
        }
      ]
    },
    {
      title: 'Project Development',
      questions: [
        {
          question: 'What types of projects does Al-Asmakh develop?',
          answer: 'We develop luxury residences, commercial properties, industrial facilities, mixed-use developments, and upcoming projects. Our portfolio includes high-quality developments across Qatar.'
        },
        {
          question: 'How can I invest in your development projects?',
          answer: 'You can invest in our development projects by contacting our project development team. We offer various investment opportunities and will guide you through the investment process, including financing options and project timelines.'
        },
        {
          question: 'What is the typical timeline for project completion?',
          answer: 'Project timelines vary based on project size and complexity. We provide detailed project timelines during the initial consultation and keep investors updated throughout the development process.'
        }
      ]
    },
    {
      title: 'Agent Services',
      questions: [
        {
          question: 'How can I become a real estate agent with Al-Asmakh?',
          answer: 'To become an agent, visit our "Become an Agent" page or contact our recruitment team. We look for motivated individuals with a passion for real estate and excellent communication skills. We provide comprehensive training and support.'
        },
        {
          question: 'What support do you provide to agents?',
          answer: 'We provide agents with marketing support, professional training, access to our property database, lead generation tools, and ongoing mentorship. Our goal is to help our agents succeed in their real estate careers.'
        },
        {
          question: 'Do agents work on commission?',
          answer: 'Yes, our agents work on a competitive commission structure. We offer attractive commission rates and additional incentives for high performers. Contact us for detailed information about our compensation packages.'
        }
      ]
    }
  ]

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <main className="min-h-screen relative bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-br from-[#001730] to-[#003366] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto">
              Find answers to common questions about our services, properties, and processes
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="space-y-8 md:space-y-12">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Category Header */}
              <div className="bg-[#001730] px-6 py-4">
                <h2 className="text-xl md:text-2xl font-semibold text-white">
                  {category.title}
                </h2>
              </div>

              {/* Questions */}
              <div className="divide-y divide-gray-200">
                {category.questions.map((item, questionIndex) => {
                  const index = `${categoryIndex}-${questionIndex}`
                  const isOpen = openIndex === index

                  return (
                    <div key={questionIndex} className="transition-all duration-300">
                      <button
                        onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                        className="w-full px-6 py-4 md:py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                      >
                        <span className="text-base md:text-lg font-medium text-[#001730] pr-4">
                          {item.question}
                        </span>
                        <div className="flex-shrink-0">
                          {isOpen ? (
                            <FaChevronUp className="w-5 h-5 text-[#001730]" />
                          ) : (
                            <FaChevronDown className="w-5 h-5 text-[#001730]" />
                          )}
                        </div>
                      </button>
                      
                      {isOpen && (
                        <div className="px-6 py-4 md:py-5 bg-gray-50 border-t border-gray-200">
                          <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 md:mt-16 bg-gradient-to-r from-[#001730] to-[#003366] rounded-lg p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Still have questions?
          </h3>
          <p className="text-lg text-gray-200 mb-6 max-w-2xl mx-auto">
            Our team is here to help. Contact us for personalized assistance with any inquiries.
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-[#001730] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
          >
            Contact Us
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}
