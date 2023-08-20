/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'pataspeludas.com.br', 'server.pataspeludas.com.br'],
  },
};

module.exports = nextConfig;
