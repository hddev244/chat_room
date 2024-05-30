/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        instrumentationHook: true,
    },
    images: {
        remotePatterns: [
          {
            protocol: 'http',
            hostname: 'localhost',
            port: '',
            pathname: '/**',
          },
        ],
        domains: ['localhost'],
      },
};

export default nextConfig;