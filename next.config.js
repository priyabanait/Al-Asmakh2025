/** @type {import('next').NextConfig} */
const nextConfig = {

  output: 'standalone', // or remove it entirely

  reactStrictMode: true,
  images: {
    unoptimized: true,  // ✅ Add this line
    remotePatterns: [
      {
        protocol: "https",
        hostname: "aredcsa.blob.core.windows.net",
      },
    ],
  },
};

module.exports = nextConfig;
