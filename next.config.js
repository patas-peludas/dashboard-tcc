/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains:
      process.env.NODE_ENV === 'development' ? ['localhost'] : ['pataspeludas'],
  },
};

module.exports = nextConfig;
