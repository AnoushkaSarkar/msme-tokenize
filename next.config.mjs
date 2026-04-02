const nextConfig = {
  images: {
    domains: ['ipfs.io', 'w3s.link', 'dweb.link'],
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
};
export default nextConfig;