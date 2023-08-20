/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3333',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '**.pataspeludas.com.br',
        port: '80',
        pathname: '/uploads/**',
      },
    ],
  },
  // images: {
  //   domains:
  //     process.env.NODE_ENV === 'development'
  //       ? ['localhost']
  //       : ['pataspeludas.com.br', 'server.pataspeludas.com.br'],
  // },
};

module.exports = nextConfig;
