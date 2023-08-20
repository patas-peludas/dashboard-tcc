/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains:
      process.env.NODE_ENV === 'development'
        ? ['localhost']
        : ['pataspeludas.com.br', 'server.pataspeludas.com.br'],
  },
};

module.exports = nextConfig;
