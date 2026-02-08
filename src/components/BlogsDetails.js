import Image from "next/image";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import Link from "next/link";

export default function BlogHero() {
  const blogs = [
    {
      title: "Discover the Art of Living in Qatar",
      description:
        "Explore lifestyle stories, community highlights, and home inspirations that define modern living across Qatar.",
      image: "/Image.png",
    },
    {
      title: "Discover the Art of Living in Qatar",
      description:
        "Explore lifestyle stories, community highlights, and home inspirations that define modern living across Qatar.",
      image: "/Image.png",
    },
    {
      title: "Discover the Art of Living in Qatar",
      description:
        "Explore lifestyle stories, community highlights, and home inspirations that define modern living across Qatar.",
      image: "/Image.png",
    },
    {
      title: "Discover the Art of Living in Qatar",
      description:
        "Explore lifestyle stories, community highlights, and home inspirations that define modern living across Qatar.",
      image: "/Image.png",
    },
    {
      title: "Discover the Art of Living in Qatar",
      description:
        "Explore lifestyle stories, community highlights, and home inspirations that define modern living across Qatar.",
      image: "/Image.png",
    },
  ];

  return (
    <div>
      <div className="relative w-full h-[70vh]">
        {/* BACKGROUND IMAGE */}
        <Image
          src="/Image (12).png"
          alt="Blog Header"
          fill
          className="object-cover"
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0"></div>

        {/* TOP BAR */}
        <div className="absolute top-16 left-2 flex items-center justify-between w-full px-0.5">
          {/* BACK BUTTON */}
          <Link
            href="/news"
            className="flex items-center gap-2 bg-[#001730] text-white px-4 py-2 rounded-md"
          >
            <FaArrowLeft size={18} />
            <span className="text-sm lg:ml-20 ml-4 font-medium">Back</span>
          </Link>

          {/* DATE + TAG */}
          <div className="flex flex-col mt-10 mr-4 items-end gap-2 w-32">
            <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-1 rounded-md text-sm text-center w-full">
              12 / 03 / 2025
            </div>
            <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-1 rounded-md text-sm text-center w-full">
              News
            </button>
          </div>
        </div>

        {/* CENTER TITLE */}
        <div className="absolute bottom-10 w-full text-center px-4">
          <h1 className="text-3xl md:text-4xl font-semibold text-white">
            Redefining Luxury Living in the Heart of Qatar
          </h1>
        </div>
      </div>

      {/* BLOG CONTENT */}
      <div className="lg:px-20 px-4">
        <h1 className="text-lg font-semibold mt-8">
          Discover the Art of Living in Qatar - We are now at a pivotal moment
          in our AI journey. Breakthroughs in generative AI are fundamentally
          changing how people interact with technology
        </h1>

        <p className="mt-10">
          Google has been investing in AI for many years and bringing its
          benefits to individuals, businesses and communities. Whether it is
          publishing state-of-the-art research, building helpful products or
          developing tools and resources that enable others, we are committed to
          making AI accessible to everyone.
        </p>

        <p className="mt-4">
          We are now at a pivotal moment in our AI journey. Breakthroughs in
          generative AI are fundamentally changing how people interact with
          technology — and at Google, we have been responsibly developing large
          language models so we can safely bring them to our products. Today, we
          are excited to share our early progress. Developers and businesses can
          now try new APIs and products that make it easy, safe and scalable to
          start building with Google is best AI models through Google Cloud and
          a new prototyping environment called MakerSuite. And in Google
          Workspace, we’re introducing new features that help people harness the
          power of generative AI to create, connect and collaborate.
        </p>

        <p className="mt-4">
          Google has been investing in AI for many years and bringing its
          benefits to individuals, businesses and communities. Whether it is
          publishing state-of-the-art research, building helpful products or
          developing tools and resources that enable others, we are committed to
          making AI accessible to everyone.
        </p>

        <p className="mt-4">
          More than 3 billion people already benefit from AI-powered features in
          Google Workspace...
        </p>

        {/* Additional paragraphs... (Your text stays same) */}
      </div>

      {/* SIMILAR BLOGS */}
      <div className="container-custom mt-10 text-center">
        <h2 className="text-[27px] md:text-[36px] font-bold text-[#001730] uppercase">
          Similar Blogs
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-8 md:px-10 p-4 sm:p-6">
        {blogs.map((blog, i) => (
          <div
            key={i}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative w-full h-80">
              <Link href={`/BlogsDetails`}>
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-fill cursor-pointer"
                />
              </Link>

              <button className="absolute top-4 left-3 bg-[#001730] text-white text-[10px] sm:text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-2 hover:bg-[#1b3a70] transition z-10 shadow-md">
                <span>EXPLORE</span>
                <FaArrowRight size={10} />
              </button>

              <div className="absolute bottom-0 left-0 right-0 bg-[#001730]/50 backdrop-blur-sm p-4 z-10">
                <h3 className="text-white font-bold text-lg mb-2">
                  {blog.title}
                </h3>
                <p className="text-white text-sm opacity-90">
                  {blog.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA SECTION */}
      <section className="py-8 bg-gray-100">
        <div className="mx-auto px-4 sm:px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex-1">
              <h2 className="text-[30px] font-semibold text-[#001730] mb-2">
                Ready to Invest in Luxury ?
              </h2>
              <div className="w-[60%] h-[0.5px] bg-gray-300 my-2"></div>
              <p className="text-base text-[#333333] leading-relaxed">
              Get in touch with our expert team to discover exclusive investment opportunities and available units in our premium luxury developments. Your dream property is just a click away. Whether you're looking for a new home, a strategic investment, or expert real estate advice, Al Asmakh is here to assist you every step of the way
              </p>
            </div>

            <div className="flex-shrink-0">
              <button className="bg-[#001730] text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-[#002d52] transition-all duration-300 flex items-center gap-3 shadow-lg">
                Contact Expert
                <FaArrowRight size={16} />
              </button>
              <p className="text-center text-sm mt-2">Explore Available Units</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
