/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      'https://pataspeludas.com.br',
      'https://server.pataspeludas.com.br',
    ],
  },
};

module.exports = nextConfig;
