'use client'

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      position: "CEO, TechStart",
      content: "Working with Al-Asmakh has been transformative for our business. Their team delivered a solution that exceeded our expectations and helped us achieve our goals faster than anticipated.",
      image: "/images/testimonial-1.jpg.svg"
    },
    {
      name: "Michael Chen",
      position: "Marketing Director, GrowthHub",
      content: "The expertise and professionalism of the Al-Asmakh team is unmatched. They not only understood our vision but enhanced it with their creative insights and technical knowledge.",
      image: "/images/testimonial-2.jpg.svg"
    },
    {
      name: "Olivia Martinez",
      position: "Founder, InnovateNow",
      content: "Al-Asmakh turned our complex requirements into a seamless digital experience. Their attention to detail and commitment to quality is evident in every aspect of our project.",
      image: "/images/testimonial-3.jpg.svg"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">What Our Clients Say</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our clients have to say about working with us.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg p-8 shadow-lg relative">
              {/* Quote icon */}
              <div className="absolute -top-4 -left-4 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              
              <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
              
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-200">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%23CBD5E0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <div>
                  <h4 className="font-medium text-dark">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <button className="btn-secondary">View More Testimonials</button>
        </div>
      </div>
    </section>
  );
}
