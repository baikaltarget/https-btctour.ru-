/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: { unoptimized: false, formats: ['image/webp'] },
  poweredByHeader: false,
};
export default nextConfig;
