/** @type {import('next').NextConfig} */
const nextConfig = {

  output: 'standalone', // or remove it entirely

  reactStrictMode: true,
  images: {
    unoptimized: true,  // ✅ Add this line
  },
};

module.exports = nextConfig;
