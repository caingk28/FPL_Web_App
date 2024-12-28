/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_FPL_API_BASE: process.env.NEXT_PUBLIC_FPL_API_BASE,
  },
}

export default nextConfig 