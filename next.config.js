

/** @type {import('next').NextConfig} */
//const nextConfig = {}

const withPWA = require("next-pwa")({
    dest: "public",
    register:true,
    skipWaiting:true,
    // disable:process.env.NODE_ENV === "development" 
    // disable is help to disable PWA in deployment mode
  });
  
  const nextConfig = withPWA({
    swcMinify: true,
    reactStrictMode: true,
    typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    }
  // write additional configuration here.
  });

  module.exports = nextConfig;