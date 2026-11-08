/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/Judeverse",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
