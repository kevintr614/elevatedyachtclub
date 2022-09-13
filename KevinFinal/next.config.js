/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    PRODUCTION: process.env.NEXT_PRODUCTION,
    CONTRACT_ADDRESS: process.env.NEXT_CONTRACT_ADDRESS,
    PUBLIC_ALCHEMY_RPC_URL: process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL,
  },
}

module.exports = nextConfig
