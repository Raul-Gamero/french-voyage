/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com"],
  },
  // Set dynamic rendering for all pages by default
  experimental: {
    // This is a fallback for pages that don't explicitly set their own dynamic export
    serverComponentsExternalPackages: ["@supabase/ssr"],
    // Temporarily disable static optimization for debugging
    disableOptimizedLoading: true,
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
}

module.exports = nextConfig

