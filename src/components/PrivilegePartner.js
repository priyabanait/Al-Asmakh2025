"use client";

import AnimatedSection from "./AnimatedSection";

export default function PrivilegePartners() {
  const partners = [
    { name: "Metro", logo: "/partner_img/1.png" },
    { name: "Naseem", logo: "/partner_img/2.png" },
    { name: "Proper Pizza", logo: "/partner_img/3.png" },
    { name: "Surgi Art", logo: "/partner_img/4.png" },
    { name: "Qatar Rail", logo: "/partner_img/5.png" },
    { name: "Snoonu", logo: "/partner_img/6.png" },
    { name: "493", logo: "/partner_img/7.png" },
    { name: "DHL", logo: "/partner_img/8.png" },
    { name: "Luge", logo: "/partner_img/9.png" },
  ];

  const partners1 = [
    { name: "Naseem", logo: "/partner_img/2.png" },
    { name: "493", logo: "/partner_img/7.png" },
    { name: "Proper Pizza", logo: "/partner_img/3.png" },
    { name: "DHL", logo: "/partner_img/8.png" },
    { name: "Luge", logo: "/partner_img/9.png" },
    { name: "Metro", logo: "/partner_img/1.png" },
    { name: "Qatar Rail", logo: "/partner_img/5.png" },
    { name: "Snoonu", logo: "/partner_img/6.png" },
    { name: "Surgi Art", logo: "/partner_img/4.png" },

  ];


  // Duplicate enough to fill screen + seamless loop
  const loop = [...partners, ...partners, ...partners1, ...partners1];

  const PartnerLogo = ({ partner }) => (
    <div
      className="flex-shrink-0"
      style={{
        width: "clamp(105px, 27vw, 135px)",
        height: "clamp(125px, 30vw, 170px)",
      }}
    >
      <div className="w-full h-full bg-white rounded-2xl p-3 flex items-center justify-center ">
        <img
          src={partner.logo}
          alt={partner.name}
          className="max-w-full max-h-full object-contain"
          loading="lazy"
        />
      </div>
    </div>
  );

  return (
    <section className="py-12 md:py-20 bg-white overflow-hidden">
      <div className=" px-4">
        {/* Heading */}
        <div className="text-center mb-10">
          <AnimatedSection direction="up" delay={0.7} duration={0.7}>
            <h2 className="text-[27px] md:text-[30px] 3xl:text-[36px] 4xl:text-[42px] font-semibold text-black tracking-widest uppercase mb-2 3xl:mb-3 4xl:mb-4">
              PRIVILEGE PARTNER
            </h2>
          </AnimatedSection>

          <AnimatedSection direction="up" delay={0.8} duration={0.7}>
            <div className="w-32 3xl:w-40 4xl:w-48 h-[0.11px] 3xl:h-[0.13px] 4xl:h-[0.15px] mt-4 3xl:mt-5 4xl:mt-6 bg-gray-300 mx-auto mb-4 3xl:mb-5 4xl:mb-6" />
          </AnimatedSection>

          <AnimatedSection direction="up" delay={0.9} duration={0.7}>
            <p className="text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
              Exclusive benefits for tenants and staff with seamless membership management.
            </p>
          </AnimatedSection>
        </div>

        {/* Mobile: Two Animated Rows */}
        <AnimatedSection direction="up" delay={1.0} duration={0.7}>
          <div className="block md:hidden space-y-8">
            {/* Row 1 – scrolls left */}
            <div className="overflow-hidden">
              <div
                className="flex gap-5 partner-scroll-left"
                style={{
                  width: "max-content",
                  display: "flex",
                  willChange: "transform",
                }}
              >
                {loop.map((p, i) => (
                  <PartnerLogo key={`row1-${i}`} partner={p} />
                ))}
                {/* Duplicate for seamless loop */}
                {loop.map((p, i) => (
                  <PartnerLogo key={`row1-dupe-${i}`} partner={p} />
                ))}
              </div>
            </div>

            {/* Row 2 – scrolls right */}
            <div className="overflow-hidden">
              <div
                className="flex gap-5 partner-scroll-right"
                style={{
                  width: "max-content",
                  display: "flex",
                  willChange: "transform",
                }}
              >
                {loop.map((p, i) => (
                  <PartnerLogo key={`row2-${i}`} partner={p} />
                ))}
                {loop.map((p, i) => (
                  <PartnerLogo key={`row2-dupe-${i}`} partner={p} />
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Desktop: Single Infinite Row - Right to Left */}
        <AnimatedSection direction="up" delay={1.0} duration={0.7}>
          <div className="hidden md:block overflow-hidden w-full">
            <div
              className="flex gap-8 partner-scroll-left"
              style={{
                width: "max-content",
                display: "flex",
                willChange: "transform",
                animation: "scroll-left 60s linear infinite",
              }}
            >
              {/* First set - will be visible initially */}
              {[...partners, ...partners, ...partners].map((p, i) => (
                <div
                  key={`desktop-${i}`}
                  className="flex-shrink-0 w-[350px] h-[350px] bg-white rounded-2xl p-8 flex items-center justify-center"
                >
                  <img src={p.logo} alt={p.name} className="max-w-full max-h-full object-contain" />
                </div>
              ))}
              {/* Duplicate for seamless loop - exact same content */}
              {[...partners, ...partners, ...partners].map((p, i) => (
                <div
                  key={`desktop-dupe-${i}`}
                  className="flex-shrink-0 w-[350px] h-[350px] bg-white rounded-2xl p-8 flex items-center justify-center"
                >
                  <img src={p.logo} alt={p.name} className="max-w-full max-h-full object-contain" />
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}