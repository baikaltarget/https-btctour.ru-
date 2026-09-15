/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: { unoptimized: false, formats: ['image/webp'] },
  poweredByHeader: false,
  // Вертолётная карточка объединена с разделом: редирект держим в конфиге,
  // чтобы он работал и на Vercel, и при локальной проверке.
  async redirects() {
    return [
      { source: '/baikal/tury/vertoletnye-ekskursii', destination: '/baikal/vertoletnye/', permanent: true },
      { source: '/baikal/tury/vertoletnye-ekskursii/', destination: '/baikal/vertoletnye/', permanent: true },
    ];
  },
};
export default nextConfig;
