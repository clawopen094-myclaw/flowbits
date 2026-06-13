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
  rewrites: async () => {
    return [
      {
        source: "/api/py/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/api/py/:path*"
            : "/api/",
      },
      {
        source: "/docs",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/api/py/docs"
            : "/api/py/docs",
      },
      {
        source: "/openapi.json",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/api/py/openapi.json"
            : "/api/py/openapi.json",
      },
      {
        source: "/api/helloFastApi",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/api/helloFastApi"
            : "/api/helloFastApi",
      },
      {
        source: "/api/launchbrowser",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/api/launchbrowser"
            : "/api/launchbrowser",
      },
    ];
  },
};


export default nextConfig;
