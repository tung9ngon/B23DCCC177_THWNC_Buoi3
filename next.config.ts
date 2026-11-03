import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // thư mục cha có package-lock khác nên phải set root
  outputFileTracingRoot: __dirname,
  // để vercel copy kèm data và font
  outputFileTracingIncludes: {
    "/**": ["./data/**/*", "./assets/**/*"],
  },
};

export default nextConfig;
