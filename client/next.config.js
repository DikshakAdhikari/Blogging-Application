/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost' , 's3.ap-south-1.amazonaws.com'], // Add any other domains if needed
      },
}

module.exports = nextConfig
