/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true, // Enable SWC compiler for minification
    webpack: (config) => {
        config.resolve.fallback = {
            fs: false,
            path: false,
            os: false,
        };
        return config;
    },
};

export default nextConfig;
