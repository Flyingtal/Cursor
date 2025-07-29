/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['maps.googleapis.com', 'lh3.googleusercontent.com', 'res.cloudinary.com'],
  },
};

export default nextConfig;