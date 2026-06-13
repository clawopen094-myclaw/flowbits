/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Mark all @cline/* packages as externals — webpack emits require()
      // Node.js runtime resolves them natively (they're ESM, already installed)
      config.externals = [...(config.externals || []), /^@cline\//];
    }
    return config;
  },
};

export default nextConfig;
