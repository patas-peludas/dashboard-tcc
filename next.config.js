/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['http://localhost:3333'],
  },
};

module.exports = nextConfig;
