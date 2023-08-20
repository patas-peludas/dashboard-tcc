/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: process.env.NODE_ENV === 'development' ? 'http' : 'https',
        hostname:
          process.env.NODE_ENV === 'development'
            ? 'localhost'
            : '**.pataspeludas.com.br',
        port: process.env.NODE_ENV === 'development' ? '3333' : '80',
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
