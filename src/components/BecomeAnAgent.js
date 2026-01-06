"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa6";
import { Building2, Target, Users, TrendingUp, Presentation, BarChart3, CheckCircle2 } from "lucide-react";

// Content configurations
const agentContent = {
    type: "partner",
    heroTitle: "Partner With Al Asmakh Real Estate",
    heroSubtitle: "Engineered for Developers. Optimized for Faster Sales.",
    mainTitle: "We Don't List Projects. We Drive Outcomes.",
    mainDescription: [
        "Al Asmakh Real Estate partners directly with developers to strategically position, commercialize, and sell real estate assets with precision and control.",
        "Our platform is purpose-built to deliver high-impact visibility, qualified buyer demand, and real-time performance intelligence — going far beyond traditional listings or brokerage models.",
        "Whether you are launching a flagship development or scaling a multi-project portfolio, we operate as an extension of your commercial and sales team, focused on one outcome: measurable sales performance."
    ],
    whyTitle: "Why Leading Developers Work With Al Asmakh",
    whyCards: [
        {
            icon: Users,
            title: "Strategic Partnership, ",
            description: "We work in close alignment with your leadership, sales, and marketing teams to ensure your project is positioned correctly, communicated clearly, and executed efficiently — from launch to sell-out."
        },
        {
            icon: TrendingUp,
            title: "Accelerated Sales Performance",
            description: "Our demand-driven ecosystem connects your project with investment-ready, qualified buyers, significantly reducing sales cycles and time-to-market."
        },
        {
            icon: Target,
            title: "Direct-to-Buyer Market Access",
            description: "We eliminate unnecessary layers between developers and buyers, ensuring message control, pricing clarity, and higher conversion efficiency."
        },
        {
            icon: Building2,
            title: "Developer-Centric Infrastructure",
            description: "Every element of our platform — from project presentation to lead workflows and analytics — is designed around developer objectives, not generic marketplace templates."
        }
    ],
    servicesTitle: "Our Developer Services",
    services: [
        {
            icon: Presentation,
            title: "Dedicated Project Representation",
            description: "Your development is presented with the clarity and authority it deserves.",
            items: [
                "Premium, purpose-built project landing pages",
                "Detailed unit mix, floor plans, availability, and pricing",
                "High-quality visuals, video assets, and immersive virtual tours",
                "Clear, conversion-focused buyer value propositions"
            ]
        },
        {
            icon: Users,
            title: "Intelligent Lead Management",
            description: "Transparency, speed, and control — without compromise.",
            items: [
                "Verified and qualified buyer inquiries",
                "Real-time lead alerts and response workflows",
                "Full visibility into lead sources and performance",
                "Zero lead reselling. Zero conflict of interest."
            ]
        },
        {
            icon: Target,
            title: "Project Marketing & Launch Execution",
            description: "From pre-launch to sustained absorption.",
            items: [
                "Strategic project launch planning",
                "Digital, performance, and targeted campaign execution",
                "Active buyer outreach and demand generation",
                "On-ground and off-plan sales support where required"
            ]
        },
        {
            icon: BarChart3,
            title: "Market Intelligence & Sales Insights",
            description: "Data-backed decisions, not assumptions.",
            items: [
                "Real-time buyer demand and behavior insights",
                "Pricing, absorption, and inventory performance analysis",
                "Continuous feedback from active buyers",
                "Actionable recommendations to optimize sales velocity"
            ]
        }
    ],
    benefitsTitle: "Partnership Benefits",
    benefits: [
        {
            title: "Strategic Partnership",
            description: "We work in close alignment with your leadership, sales, and marketing teams to ensure your project is positioned correctly and executed efficiently."
        },
        {
            title: "Accelerated Sales",
            description: "Our demand-driven ecosystem connects your project with investment-ready, qualified buyers, significantly reducing sales cycles and time-to-market."
        },
        {
            title: "Direct Market Access",
            description: "We eliminate unnecessary layers between developers and buyers, ensuring message control, pricing clarity, and higher conversion efficiency."
        },
        {
            title: "Developer-Centric Platform",
            description: "Every element of our platform is designed around developer objectives, not generic marketplace templates."
        }
    ],
    closingTitle: "Built for Developers Who Think Long-Term",
    closingDescription: [
        "Al Asmakh works with developers who value transparency, execution discipline, and sustained performance — not short-term exposure.",
        "If your objective is to sell smarter, faster, and with full control, we are built for you."
    ],
    contactTitle: "Let's Discuss Your Next Project",
    contactDescription: [
        "Connect with our developer partnerships team to explore how Al Asmakh can support your project's commercial success.",
        "Partner with confidence. Execute with precision. Deliver results."
    ],
    formTitle: "Let's Discuss Your Next Project",
    formPlaceholder: "Tell us more about your requirement like budget ,area & others .."
};

const partnerContent = {
    type: "agent",
    heroTitle: "Engineered for Developers.",
    heroSubtitle: "For Licensed Real Estate Professionals. Built to Close Serious Deals.",
    mainTitle: "This Platform Is Built for Real Estate Agents — Not Everyone.",
    mainDescription: [
        "Al Asmakh Real Estate partners with licensed, professional real estate agents who operate with discipline, compliance, and a results-first mindset.",
        "We are not a mass-market brokerage.",
        "We are a structured, developer-connected real estate platform designed to support agents who focus on quality transactions, qualified clients, and long-term growth.",
        "If your objective is to work with credible inventory, serious buyers, and a professional operating environment, Al Asmakh is built for you."
    ],
    whyTitle: "Why Real Estate Agents Work With Al Asmakh",
    whyCards: [
        {
            icon: Building2,
            title: "Direct Access to Developer & Premium Inventory",
            description: "Represent projects and listings sourced directly from trusted developers and verified owners — accurate pricing, clear documentation, no duplication."
        },
        {
            icon: Users,
            title: "Qualified Buyer Inquiries",
            description: "Engage with genuine, transaction-ready buyers, reducing wasted time and improving close rates."
        },
        {
            icon: Target,
            title: "Institutional Brand Credibility",
            description: "Operate under a brand that strengthens client confidence, negotiation authority, and deal efficiency."
        },
        {
            icon: Presentation,
            title: "Systems Designed for Professional Agents",
            description: "Lead flows, reporting, and support structures are built to enable agents to perform, not to overwhelm them."
        }
    ],
    servicesTitle: "What Al Asmakh Provides Its Agents",
    services: [
        {
            icon: Building2,
            title: "Verified Inventory Access",
            description: "",
            items: [
                "Developer-direct off-plan projects",
                "Residential and commercial listings",
                "Clear unit availability and pricing",
                "Compliance-aligned documentation"
            ]
        },
        {
            icon: Users,
            title: "Structured Lead Support",
            description: "",
            items: [
                "Verified buyer inquiries",
                "Clear lead allocation processes",
                "Transparent performance visibility",
                "No lead reselling or conflict of interest"
            ]
        },
        {
            icon: Presentation,
            title: "Marketing & Transaction Support",
            description: "",
            items: [
                "Professional listing and project materials",
                "High-quality visuals and virtual tours",
                "Support for buyer presentations",
                "Coordination during negotiation and closing"
            ]
        },
        {
            icon: BarChart3,
            title: "Market Intelligence & Insights",
            description: "",
            items: [
                "Buyer demand and inquiry trends",
                "Pricing and market movement insights",
                "Feedback from active transactions",
                "Data to strengthen advisory discussions"
            ]
        }
    ],
    benefitsTitle: "Who Should Join Al Asmakh",
    benefits: [
        {
            title: "Licensed real estate agents",
            description: "Professionals with proper licensing and credentials."
        },
        {
            title: "Experienced brokers and consultants",
            description: "Seasoned professionals with proven track records."
        },
        {
            title: "Specialists in residential, commercial, or off-plan",
            description: "Agents with expertise in specific market segments."
        },
        {
            title: "Professionals committed to ethical practices",
            description: "Agents who value transparency and compliance."
        }
    ],
    closingTitle: "A Professional Environment Built for Closers",
    closingDescription: [
        "You focus on: Client relationships, Advisory and negotiation, Closing transactions",
        "We support you with: Credible inventory, Qualified buyer demand, Brand trust and systems, Operational clarity",
        "This is a long-term professional partnership, not a lead marketplace."
    ],
    contactTitle: "Apply to Become an  Real Estate Agent",
    contactDescription: [
        "Join a platform built to support professional agents operating at a higher standard."
    ],
    formTitle: "Apply to Become an  Real Estate Agent",
    formPlaceholder: "Tell us more about your experience, licensing, and why you want to join Al Asmakh..."
};

export default function BecomeAnAgent({ mode = "agent" }) {
    const content = mode === "partner" ? partnerContent : agentContent;
    const partnerVideoRef = useRef(null);
    const agentVideoRef = useRef(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        projectType: "",
        message: "",
    });


    const [selectedCountryCode, setSelectedCountryCode] = useState("+974"); // Default to Qatar
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const countryDropdownRef = useRef(null);
    // Handle video playback for both modes
    useEffect(() => {
        if (mode === "partner" && partnerVideoRef.current) {
            // Ensure video is loaded and play
            const playPartnerVideo = async () => {
                try {
                    partnerVideoRef.current.currentTime = 0;
                    await partnerVideoRef.current.play();
                } catch (error) {
                    console.error("Error playing partner video:", error);
                }
            };
            playPartnerVideo();
            // Pause agent video if it's playing
            if (agentVideoRef.current) {
                agentVideoRef.current.pause();
                agentVideoRef.current.currentTime = 0;
            }
        } else if (mode === "agent" && agentVideoRef.current) {
            // Ensure video is loaded and play
            const playAgentVideo = async () => {
                try {
                    agentVideoRef.current.currentTime = 0;
                    await agentVideoRef.current.play();
                } catch (error) {
                    console.error("Error playing agent video:", error);
                }
            };
            playAgentVideo();
            // Pause partner video if it's playing
            if (partnerVideoRef.current) {
                partnerVideoRef.current.pause();
                partnerVideoRef.current.currentTime = 0;
            }
        }
    }, [mode]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        // Handle form submission here
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section with Background Video/Image */}
            <section className="relative w-full min-h-[100vh] lg:min-h-[100vh] flex items-center justify-center overflow-hidden">
                {/* Background Video for Both Modes */}
                <div className="absolute inset-0 z-0">
                    {mode === "partner" ? (
                        <>
                            {/* Fallback Image - Behind video */}
                            <div className="absolute inset-0">
                                <Image
                                    src="/images/act2.png"
                                    alt="Background"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                            {/* Video Background for Partner/Developer Mode */}
                            <video
                                ref={partnerVideoRef}
                                src="/images/devloper.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover"
                                onLoadedData={() => {
                                    if (partnerVideoRef.current && mode === "partner") {
                                        partnerVideoRef.current.play().catch(console.error);
                                    }
                                }}
                            />
                        </>
                    ) : (
                        <>
                            {/* Fallback Image - Behind video */}
                            <div className="absolute inset-0">
                                <Image
                                    src="/images/BG_Form.png"
                                    alt="Background"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                            {/* Video Background for Agent Mode */}
                            <video
                                ref={agentVideoRef}
                                src="/images/agents.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover"
                                onLoadedData={() => {
                                    if (agentVideoRef.current && mode === "agent") {
                                        agentVideoRef.current.play().catch(console.error);
                                    }
                                }}
                            />
                        </>
                    )}
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>

                {/* Header */}
                <div className="absolute top-0 left-0 right-0 z-10">
                    {/* Header content can be added here if needed */}
                </div>

                {/* Center Card */}
                <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 lg:mt-32">
                    <></>
                </div>

                {/* Glass Effect Stats Card - Left Aligned */}
                <div className="absolute left-4 md:left-8 lg:left-12 top-[55%] md:top-[56%] lg:top-[57%] transform -translate-y-1/2 z-20 w-[90%] md:w-[60%] lg:w-[60%]">
                    <div className="glass-effect text-center rounded-lg shadow-lg p-4 sm:p-6 md:p-10 lg:text-left">
                        {/* Title */}
                        <h2 className="heading font-semibold text-[#001730] mb-3 sm:mb-4 lg:mr-60">
                            {mode === "partner" ? "Become an  Real Estate Agent" : "Engineered for Developers."}
                        </h2>
                        <div className="h-[0.5px] bg-gray-300 my-3 sm:my-4"></div>
                        {/* Subtitle */}
                        <p className="subheading mb-10 font-semibold text-[#001730] lg:mr-40">
                            {mode === "partner"
                                ? "This Platform Is Built for Real Estate Agents — Not Everyone.Al Asmakh Real Estate partners with licensed, professional real estate agents who operate with discipline, compliance, and a results-first mindset."
                                : "We Don’t List Projects. We Drive Outcomes. Our platform is purpose-built to deliver high-impact visibility, qualified buyer demand, and real-time performance intelligence — going far beyond traditional listings or brokerage models."}
                        </p>

                        {/* Stats Section */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:mr-40 text-center">
                            <div className="glass-effect rounded-lg shadow p-3 sm:p-4 min-w-[150px] md:min-w-[160px]">
                                <p className="text-xl sm:text-2xl  text-[#001730]">500+</p>
                                <div className="w-[70%] h-[0.5px] bg-gray-300 my-1 sm:my-2 mx-auto"></div>
                                <p className="subheading text-[#001730]">Increase in Property Views</p>
                            </div>

                            <div className="glass-effect rounded-lg shadow p-3 sm:p-4 min-w-[140px] md:min-w-[160px]">
                                <p className="text-xl sm:text-2xl  text-[#001730]">60%</p>
                                <div className="w-[70%] h-[0.5px] bg-gray-300 my-1 sm:my-2 mx-auto"></div>
                                <p className="subheading text-[#001730]">Faster Luxury Sale Times</p>
                            </div>

                            <div className="glass-effect rounded-lg shadow p-3 sm:p-4 min-w-[140px] md:min-w-[160px]">
                                <p className="text-xl sm:text-2xl  text-[#001730]">25%</p>
                                <div className="w-[70%] h-[0.5px] bg-gray-300 my-1 sm:my-2 mx-auto"></div>
                                <p className="subheading text-[#001730]">Higher Sale Prices Achieved</p>
                            </div>

                            <div className="glass-effect rounded-lg shadow p-3 sm:p-4 min-w-[140px] md:min-w-[160px]">
                                <p className="text-xl sm:text-2xl  text-[#001730]">98%</p>
                                <div className="w-[70%] h-[0.5px] bg-gray-300 my-1 sm:my-2 mx-auto"></div>
                                <p className="subheading text-[#001730]">Elite Client Satisfaction Rate</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Team Button - Below the box */}
                    <div className="mt-4 lg:mt-6">
                        <div className="flex-shrink-0 lg:mr-40">
                            <button className="btn-details text-[12px]">
                                <span>{mode === "partner" ? "Apply Now" : "Get Started"}</span>
                                <FaArrowRight size={12} className="md:w-[14px] md:h-[14px] ml-4 md:ml-16" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Section */}
            <section className="py-12 lg:py-20 px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24">
                <div className="max-w-6xl mx-auto">
                    {/* Main Description Section */}
                    {/* <div className="mb-16 lg:mb-24">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl  text-[#001730] mb-6 lg:mb-8 text-center">
                            {content.mainTitle}
                        </h2>
                        <div className="w-32 sm:w-40 lg:w-48 h-[0.5px] bg-gray-300 mx-auto mb-6 lg:mb-8"></div>
                        {content.mainDescription.map((paragraph, index) => (
                            <p key={index} className={`text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed ${index < content.mainDescription.length - 1 ? 'mb-4' : ''} text-center max-w-4xl mx-auto`}>
                                {paragraph}
                            </p>
                        ))}
                    </div> */}

                    {/* Why Section */}
                    <div className="mb-16 lg:mb-24">
                        <h2 className="text-xl sm:text-2xl lg:text-2xl  text-[#001730] mb-6 lg:mb-12 text-center">
                            {content.whyTitle}
                        </h2>
                        <div className="w-32 sm:w-40 lg:w-48 h-[0.5px] bg-gray-300 mx-auto mb-8 lg:mb-12"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                            {content.whyCards.map((card, index) => {
                                const IconComponent = card.icon;
                                return (
                                    <div key={index} className="bg-[#EEEEEE] rounded-lg p-6 lg:p-8 shadow-md hover:shadow-xl transition-all">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="bg-[#001730] p-3 rounded-lg flex-shrink-0">
                                                <IconComponent className="text-white w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg lg:text-xl font-semibold text-[#001730] mb-2">
                                                    {card.title}
                                                </h3>
                                                <p className="text-sm lg:text-base text-gray-700 leading-relaxed">
                                                    {card.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Services Section */}
                    <div className="mb-16 lg:mb-24">
                        <h2 className="text-xl sm:text-2xl lg:text-3xl  text-[#001730] mb-6 lg:mb-12 text-center">
                            {content.servicesTitle}
                        </h2>
                        <div className="w-32 sm:w-40 lg:w-48 h-[0.5px] bg-gray-300 mx-auto mb-8 lg:mb-12"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                            {content.services.map((service, index) => {
                                const IconComponent = service.icon;
                                return (
                                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 lg:p-8 shadow-md hover:shadow-xl transition-all">
                                        <div className="flex items-center gap-3 mb-4">
                                            <IconComponent className="text-[#001730] w-8 h-8" />
                                            <h3 className="text-lg lg:text-xl font-semibold text-[#001730]">
                                                {service.title}
                                            </h3>
                                        </div>
                                        {/* {service.description && (
                                            <p className="text-sm lg:text-base text-gray-700 mb-4">
                                                {service.description}
                                            </p>
                                        )} */}
                                        <ul className="space-y-2">
                                            {service.items.map((item, itemIndex) => (
                                                <li key={itemIndex} className="flex items-start gap-2 text-sm lg:text-base text-gray-700">
                                                    <CheckCircle2 className="text-[#001730] w-5 h-5 flex-shrink-0 mt-0.5" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Benefits Cards Section */}


                    {/* Closing Section */}
                    {/* <div className="mb-16 lg:mb-24 text-center">
                        <h2 className="text-xl sm:text-2xl lg:text-3xl  text-[#001730] mb-6 lg:mb-8">
                            {content.closingTitle}
                        </h2>
                        <div className="w-32 sm:w-40 lg:w-48 h-[0.5px] bg-gray-300 mx-auto mb-6 lg:mb-8"></div>
                        {content.closingDescription.map((paragraph, index) => (
                            <p key={index} className={`text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto ${index < content.closingDescription.length - 1 ? 'mb-4' : ''}`}>
                                {paragraph}
                            </p>
                        ))}
                    </div> */}
                </div>
            </section>

            {/* Contact Card Section */}
            <section className="w-full">


             



                <section className="relative w-full h-auto lg:min-h-screen flex items-center py-8 lg:py-12 xl:py-16 2xl:py-20 overflow-hidden">
        {/* Background Image */}
        <Image
          src="/WhatsApp Image 2025-11-07 at 10.45.55 PM.jpeg"
          alt="Background"
          fill
          className="object-cover"
        />

        {/* Content Container */}
        <div className="relative z-10 max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1600px] 3xl:max-w-[1920px] 4xl:max-w-[2560px] mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="flex flex-col lg:flex-row w-full items-start justify-between gap-6 lg:gap-8 xl:gap-12">
            {/* Left Side Title - Overlaid on background */}
            <div className="text-white lg:w-1/2 flex flex-col justify-center lg:mt-0">
              <h2 className="text-base lg:text-2xl xl:text-3xl 2xl:text-4xl text-center lg:text-left mb-2 lg:mb-3">
              Join a platform built to support professional agents operating at a higher standard.
              </h2>
              <div className="h-[0.5px] w-[75%] bg-gray-300 mx-auto lg:mx-0 mb-3 lg:mb-4"></div>
            </div>

            {/* Right Side - Form Panel and Map */}
            <div className="lg:w-1/2 w-full flex flex-col">
              {/* Form Panel - Translucent */}
              <div className="bg-blue-50/10 backdrop-blur-sm p-4 lg:p-6 xl:p-8 lg:px-8 xl:px-12 2xl:px-16 rounded-md shadow-xl relative overflow-hidden">
                {/* Form Header */}
                <h3 className="text-[#001730] text-xs lg:text-sm xl:text-base text-center font-medium mb-2 lg:mb-3">
                Connect with our developer partnerships team , . Execute with precision. Deliver results.

                </h3>
                <div className="h-[0.5px] w-40 lg:w-60 bg-gray-300 mb-3 lg:mb-4 mx-auto"></div>


                <form className="space-y-3 lg:space-y-4">
                  {/* First Row: Name and Email */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-2">
                    <div>
                      <label className="block text-[#001730] text-xs lg:text-sm font-medium mb-1.5 lg:mb-2">Name</label>
                      <input
                        type="text"
                        placeholder="Enter Your Name"
                        className="w-full bg-white border border-gray-300 rounded-md px-3 lg:px-4 py-2 lg:py-2.5 text-sm focus:outline-none focus:border-[#001730] h-[42px] lg:h-[45px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#001730] text-xs lg:text-sm font-medium mb-1.5 lg:mb-2">Email</label>
                      <input
                        type="email"
                        placeholder="Enter Your Email"
                        className="w-full bg-white border border-gray-300 rounded-md px-3 lg:px-4 py-2 lg:py-2.5 text-sm focus:outline-none focus:border-[#001730] h-[42px] lg:h-[45px]"
                      />
                    </div>
                  </div>

                  {/* Second Row: Phone and Property Type */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                    <div className="flex flex-col">
                      <label className="block text-[#001730] text-xs lg:text-sm font-medium mb-1.5 lg:mb-2">Phone</label>
                      <div className="flex relative h-[42px] lg:h-[45px]" ref={countryDropdownRef}>
                        {/* Country Code Dropdown - Left Side */}
                        <div className="relative flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                            className="h-[42px] lg:h-[45px] px-2 flex items-center justify-center gap-0 outline-none hover:bg-gray-50 bg-white border border-r-0 border-gray-300 rounded-l-md"
                            style={{ fontSize: '12px', color: "#001730" }}
                          >
                            <span>{selectedCountryCode}</span>
                            <svg
                              className={`w-3 h-3 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          {/* Divider */}
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-5 bg-gray-300"></div>
                          {/* Country Dropdown Menu */}
                          {showCountryDropdown && (
                            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-50 min-w-[280px]">
                              {[
                                { code: "+974", country: "Qatar", flag: "🇶🇦" },
                                { code: "+971", country: "UAE", flag: "🇦🇪" },
                                { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
                                { code: "+965", country: "Kuwait", flag: "🇰🇼" },
                                { code: "+973", country: "Bahrain", flag: "🇧🇭" },
                                { code: "+968", country: "Oman", flag: "🇴🇲" },
                                { code: "+1", country: "USA/Canada", flag: "🇺🇸" },
                                { code: "+44", country: "UK", flag: "🇬🇧" },
                                { code: "+91", country: "India", flag: "🇮🇳" },
                                { code: "+86", country: "China", flag: "🇨🇳" },
                                { code: "+81", country: "Japan", flag: "🇯🇵" },
                                { code: "+82", country: "South Korea", flag: "🇰🇷" },
                                { code: "+33", country: "France", flag: "🇫🇷" },
                                { code: "+49", country: "Germany", flag: "🇩🇪" },
                                { code: "+39", country: "Italy", flag: "🇮🇹" },
                                { code: "+34", country: "Spain", flag: "🇪🇸" },
                                { code: "+61", country: "Australia", flag: "🇦🇺" },
                                { code: "+27", country: "South Africa", flag: "🇿🇦" },
                                { code: "+20", country: "Egypt", flag: "🇪🇬" },
                                { code: "+212", country: "Morocco", flag: "🇲🇦" },
                                { code: "+90", country: "Turkey", flag: "🇹🇷" },
                                { code: "+7", country: "Russia", flag: "🇷🇺" },
                                { code: "+55", country: "Brazil", flag: "🇧🇷" },
                                { code: "+52", country: "Mexico", flag: "🇲🇽" },
                                { code: "+234", country: "Nigeria", flag: "🇳🇬" },
                                { code: "+92", country: "Pakistan", flag: "🇵🇰" },
                                { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
                                { code: "+62", country: "Indonesia", flag: "🇮🇩" },
                                { code: "+60", country: "Malaysia", flag: "🇲🇾" },
                                { code: "+65", country: "Singapore", flag: "🇸🇬" },
                                { code: "+66", country: "Thailand", flag: "🇹🇭" },
                                { code: "+84", country: "Vietnam", flag: "🇻🇳" },
                                { code: "+63", country: "Philippines", flag: "🇵🇭" },
                              ].map((item) => (
                                <button
                                  key={item.code}
                                  type="button"
                                  onClick={() => {
                                    setSelectedCountryCode(item.code);
                                    setShowCountryDropdown(false);
                                  }}
                                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 ${
                                    selectedCountryCode === item.code ? 'bg-gray-100 font-semibold' : ''
                                  }`}
                                  style={{ fontSize: '12px' }}
                                >
                                  <span>{item.flag}</span>
                                  <span className="flex-1">{item.country}</span>
                                  <span className="text-gray-600">{item.code}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        {/* Phone Number Input - Right Side */}
                        <input
                          type="text"
                          placeholder="(123) 456 - 789"
                          className="flex-1 bg-white border border-l-0 border-gray-300 rounded-r-md px-3 lg:px-4 py-2 lg:py-2.5 text-sm focus:outline-none focus:border-[#001730] h-full"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <label className="block text-[#001730] text-xs lg:text-sm font-medium mb-1.5 lg:mb-2">Property Type</label>
                      <select
                        className="w-full bg-white border border-gray-300 rounded-md px-3 lg:px-4 py-2 lg:py-2.5 text-sm text-gray-500 focus:outline-none focus:border-[#001730] h-[42px] lg:h-[45px]"
                      >
                        <option>Choose a Type</option>
                        <option>Apartment</option>
                        <option>Villa</option>
                        <option>Commercial</option>
                      </select>
                    </div>
                  </div>

                  {/* Message Textarea */}
                  <div>
                    <label className="block text-[#001730] text-xs lg:text-sm mb-1.5 lg:mb-2">Message</label>
                    <textarea
                      placeholder="Tell us more about your requirement like budget ,area & others .."
                      rows={3}
                      className="w-full bg-white border border-gray-300 rounded-md px-3 lg:px-4 py-2 lg:py-2.5 text-sm focus:outline-none focus:border-[#001730] resize-none"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="bg-[#001730] text-white text-[12px] px-6 lg:px-8 py-2 lg:py-2.5 rounded-md flex items-center justify-center lg:justify-end gap-2 hover:bg-[#0d2142] transition w-full lg:w-auto"
                  >
                    <span className="text-[12px]">Submit</span>
                    <FaArrowRight size={12} className="lg:w-[12px] lg:h-[12px] ml-2 lg:ml-20" />
                  </button>
                </form>
              </div>

              {/* Map Section - Below the blur card */}
              <div className="mt-4 lg:mt-6 xl:mt-8 w-full h-[15vh] lg:h-[20vh] xl:h-[22vh] rounded-md overflow-hidden bg-gray-200 border border-gray-300 relative">
                <Image
                  src="/675.png"
                  alt="Map"
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

            </section>
        </div>
    );
}

