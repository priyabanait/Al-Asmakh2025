"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import Link from "next/link";
import { useBlog, useBlogs } from "../hooks/useBlogs";

export default function BlogHero() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const blogId = searchParams?.get("id");

  // Fetch the current blog
  const { data: blogData, isLoading: blogLoading, error: blogError } = useBlog(blogId);
  const blog = blogData;

  // Fetch all blogs for related blogs section
  const { data: allBlogsData, isLoading: allBlogsLoading } = useBlogs({
    page: 1,
    limit: 50,
    // Removed publishStatus filter to get all blogs from API
    // The hook will filter for Blog/Article content types and handle publishStatus internally
  });

  const allBlogs = allBlogsData?.blogs || [];
  
  // Get related blogs (exclude current blog, limit to 3)
  const relatedBlogs = allBlogs
    .filter(b => b.id !== blogId)
    .slice(0, 3);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day} / ${month} / ${year}`;
    } catch {
      return '';
    }
  };

  // Loading state
  if (blogLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-[#001730] text-lg">Loading blog...</div>
      </div>
    );
  }

  // Error state
  if (blogError || !blog) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600 text-lg">Error loading blog: {blogError?.message || 'Blog not found'}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="relative w-full aspect-video">
        {/* BACKGROUND IMAGE - 16:9 ratio */}
        <Image
          src={blog.image || "/Image (12).png"}
          alt={blog.title}
          fill
          className="object-cover"
          priority
          unoptimized={blog.image && blog.image.startsWith('http')}
          onError={(e) => {
            e.target.src = '/Image (12).png';
          }}
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* TOP BAR */}
        <div className="absolute top-16 left-2 flex items-center justify-between w-full px-0.5">
          {/* BACK BUTTON */}
          <button
            onClick={() => router.push("/listings/blogs")}
            className="flex items-center gap-2 bg-[#001730] text-white px-4 py-2 rounded-md hover:bg-[#1b3a70] transition"
          >
            <FaArrowLeft size={18} />
            <span className="text-sm lg:ml-20 ml-4 font-medium">Back</span>
          </button>

          {/* DATE + TAG */}
          <div className="flex flex-col mt-10 mr-4 items-end gap-2 w-32">
            <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-1 rounded-md text-sm text-center w-full">
              {formatDate(blog.createdAt)}
            </div>
            <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-1 rounded-md text-sm text-center w-full">
              {blog.contentType || 'Blog'}
            </div>
          </div>
        </div>

        {/* CENTER TITLE (Desktop only to avoid duplicate title on mobile) */}
        <div className="absolute bottom-10 w-full text-center px-4 hidden lg:block">
          <h1 className="text-3xl md:text-4xl font-semibold text-white">
            {blog.title}
          </h1>
        </div>
      </div>

      {/* BLOG CONTENT */}
      <div className="lg:px-20 px-4 py-8">
        {/* Main title (shown on mobile only; hero title is desktop-only) */}
        <h1 className="text-2xl lg:text-3xl font-semibold mt-8 mb-4 text-[#001730] lg:hidden">
          {blog.title}
        </h1>

        {/* Category and Date Info */}
        <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
          {blog.category && (
            <span className="bg-gray-100 px-3 py-1 rounded-md">{blog.category}</span>
          )}
          {blog.createdAt && (
            <span>{formatDate(blog.createdAt)}</span>
          )}
        </div>

        {blog.body && (
          <div 
            className="mt-10 prose prose-lg max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: blog.body.replace(/<p[^>]*>/gi, '<div>').replace(/<\/p>/gi, '</div>') 
            }}
          />
        )}

        {!blog.body && blog.description && (
          <div className="mt-10 text-gray-700 leading-relaxed space-y-4">
            <div>{blog.description}</div>
          </div>
        )}
      </div>

      {/* SIMILAR BLOGS */}
      {relatedBlogs.length > 0 && (
        <>
          <div className="container-custom mt-10 text-center">
            <h2 className="text-[27px] md:text-[36px] font-bold text-[#001730] uppercase">
              Related Blogs
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-8 md:px-10 p-4 sm:p-6">
            {relatedBlogs.map((relatedBlog, i) => (
              <div
                key={relatedBlog.id || i}
                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative w-full aspect-video">
                  <Link href={`/BlogsDetails?id=${relatedBlog.id}`}>
                    <Image
                      src={relatedBlog.image || '/Image.png'}
                      alt={relatedBlog.title}
                      fill
                      className="object-cover cursor-pointer"
                      unoptimized={relatedBlog.image && relatedBlog.image.startsWith('http')}
                      onError={(e) => {
                        e.target.src = '/Image.png';
                      }}
                    />
                  </Link>

                  {/* EXPLORE Button */}
                  <Link href={`/BlogsDetails?id=${relatedBlog.id}`}>
                    <button className="absolute top-4 sm:top-8 left-3 sm:left-4 bg-[#001730] text-white text-[10px] sm:text-xs font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded flex items-center gap-2 hover:bg-[#1b3a70] transition z-10 shadow-md">
                      <span>EXPLORE</span>
                      <FaArrowRight size={10} className="sm:w-[12px] sm:h-[12px] sm:ml-6" />
                    </button>
                  </Link>

                  {/* Text Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-[#001730]/50 backdrop-blur-sm p-4 sm:p-6 z-10">
                    <h3 className="text-white font-bold text-base sm:text-lg md:text-xl mb-2 sm:mb-3">
                      {relatedBlog.title}
                    </h3>
                    {relatedBlog.description && (
                      <div
                        className="text-white text-xs sm:text-sm md:text-base leading-relaxed opacity-90"
                        dangerouslySetInnerHTML={{
                          __html: relatedBlog.description,
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* CONTACT SECTION - Matching agent contact design */}
      <section className="bg-gray-100 py-8 px-4 sm:px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-[10px] shadow-md overflow-hidden flex flex-col lg:flex-row items-start w-full">
            {/* LEFT IMAGE */}
            <div className="w-full lg:w-1/2 rounded-[10px] relative flex-shrink-0 h-48 sm:h-52 lg:min-h-[300px] lg:max-h-[300px] p-3 sm:p-4 lg:pr-0 lg:mr-0">
              <div className="h-full w-full bg-gradient-to-br from-[#001730] to-[#0B1F3A] flex items-center justify-center rounded-[5px]">
                <div className="text-center text-white p-6">
                  <h3 className="text-xl sm:text-2xl font-semibold mb-2">Al Asmakh Real Estate</h3>
                  <div className="w-[30%] h-[0.2px] bg-gray-400 my-2 mx-auto"></div>
                  <p className="text-gray-300 text-sm">Expert Real Estate Services</p>
                </div>
              </div>
            </div>

            {/* RIGHT DETAILS */}
            <div className="w-full lg:w-1/2 p-3 sm:p-4 flex flex-col">
              <div>
                <div className="shadow-md bg-white text-center p-2 sm:p-3 rounded-[5px]">
                  <h3 className="text-sm sm:text-base font-semibold text-[#001730] mb-1">
                    Contact Our Experts
                  </h3>
                  <div className="w-[30%] h-[0.2px] bg-gray-400 my-1 mx-auto"></div>
                  <p className="text-gray-500 text-xs">Get Professional Assistance</p>
                </div>

                {/* Description */}
                <div className="relative mt-4">
                  <p className="absolute top-[-9px] text-xs text-gray-400 ml-2">
                    About:
                  </p>
                  <p className="bg-white mt-1 p-2 sm:p-3 shadow-md rounded-[5px] text-xs text-gray-700">
                    Get in touch with our expert team to discover exclusive investment opportunities and available units in our premium luxury developments. Your dream property is just a click away.
                  </p>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="mt-3 flex flex-col gap-2">
                <div className="flex gap-2">
                  <a
                    href="tel:+97412345678"
                    className="flex-1 bg-[#001730] text-white py-1.5 sm:py-2 rounded-[5px] flex justify-between items-center px-3 text-[12px] hover:opacity-90 transition"
                  >
                    Call Us
                    <FaArrowRight size={12} />
                  </a>

                  <a
                    href="mailto:info@alasmakhrealestate.com"
                    className="flex-1 bg-[#001730] text-white py-1.5 sm:py-2 rounded-[5px] flex justify-between items-center px-3 text-[12px] hover:opacity-90 transition"
                  >
                    Send email
                    <FaArrowRight size={12} />
                  </a>
                </div>

                <Link href="/contact">
                  <button className="w-full bg-[#001730] text-white py-1.5 sm:py-2 rounded-[5px] flex justify-between items-center px-3 text-[12px] hover:opacity-90 transition">
                    Contact Expert
                    <FaArrowRight size={12} />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
