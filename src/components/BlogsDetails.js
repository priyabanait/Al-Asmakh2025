"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import Link from "next/link";
import { useBlog, useBlogs } from "../hooks/useBlogs";

export default function BlogHero() {
  const searchParams = useSearchParams();
  const blogId = searchParams?.get("id");

  // Fetch the current blog
  const { data: blogData, isLoading: blogLoading, error: blogError } = useBlog(blogId);
  const blog = blogData;

  // Fetch all blogs for related blogs section
  const { data: allBlogsData, isLoading: allBlogsLoading } = useBlogs({
    page: 1,
    limit: 50,
    publishStatus: 'Published',
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
      <div className="relative w-full h-[70vh]">
        {/* BACKGROUND IMAGE */}
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
          <Link
            href="/listings/blogs"
            className="flex items-center gap-2 bg-[#001730] text-white px-4 py-2 rounded-md hover:bg-[#1b3a70] transition"
          >
            <FaArrowLeft size={18} />
            <span className="text-sm lg:ml-20 ml-4 font-medium">Back</span>
          </Link>

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

        {/* CENTER TITLE */}
        <div className="absolute bottom-10 w-full text-center px-4">
          <h1 className="text-3xl md:text-4xl font-semibold text-white">
            {blog.title}
          </h1>
        </div>
      </div>

      {/* BLOG CONTENT */}
      <div className="lg:px-20 px-4 py-8">
        <h1 className="text-lg font-semibold mt-8 mb-4">
          {blog.title}
        </h1>

        {blog.body && (
          <div 
            className="mt-10 prose prose-lg max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.body }}
          />
        )}

        {!blog.body && blog.description && (
          <div className="mt-10 text-gray-700 leading-relaxed space-y-4">
            <p>{blog.description}</p>
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
                <div className="relative w-full h-80 lg:h-80">
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
                    <p className="text-white text-xs sm:text-sm md:text-base leading-relaxed opacity-90">
                      {relatedBlog.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

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
