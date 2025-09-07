/** @type {import('next').NextConfig} */

// 👇 Force Next.js to use Webpack instead of Turbopack in dev
// process.env.NEXT_DISABLE_TURBOPACK = "1";

 const nextConfig = {
//   // === COMPILATION OPTIMIZATION ===
//   experimental: {
//     optimizeCss: true,
//   },

//   serverExternalPackages: [
//     "@supabase/supabase-js",
//     "bcryptjs",
//     "jsonwebtoken",
//     "zod",
//   ],

//   // === WEBPACK OPTIMIZATION ===
//   webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
//     if (isServer) {
//       config.optimization = {
//         ...config.optimization,
//         splitChunks: {
//           ...config.optimization?.splitChunks,
//           chunks: "all",
//           cacheGroups: {
//             api: {
//               test: /[\\/]api[\\/]/,
//               name: "api-routes",
//               chunks: "all",
//               priority: 20,
//               enforce: true,
//             },
//             auth: {
//               test: /[\\/](auth|supabase)[\\/]/,
//               name: "auth-modules",
//               chunks: "all",
//               priority: 15,
//               enforce: true,
//             },
//             validation: {
//               test: /[\\/](zod|validate|schema)[\\/]/,
//               name: "validation-modules",
//               chunks: "all",
//               priority: 10,
//               enforce: true,
//             },
//           },
//         },
//         concatenateModules: true,
//         minimize: !dev,
//       };

//       config.resolve = {
//         ...config.resolve,
//         symlinks: false,
//         extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
//       };

//       config.cache = {
//         type: "filesystem",
//         allowCollectingMemory: true,
//       };
//     }

//     return config;
//   },

//   // Other configuration remains the same...
//   compiler: {
//     removeConsole:
//       process.env.NODE_ENV === "production"
//         ? {
//             exclude: ["error", "warn"],
//           }
//         : false,
//   },

//   output: "standalone",
//   staticPageGenerationTimeout: 60,
//   poweredByHeader: false,

//   images: {
//     minimumCacheTTL: 86400,
//     formats: ["image/webp", "image/avif"],
//   },

//   async headers() {
//     return [
//       {
//         source: "/_next/static/:path*",
//         headers: [
//           {
//             key: "Cache-Control",
//             value: "public, max-age=31536000, immutable",
//           },
//         ],
//       },
//       {
//         source: "/api/:path*",
//         headers: [
//           {
//             key: "Cache-Control",
//             value: "no-cache, no-store, must-revalidate",
//           },
//           {
//             key: "X-Content-Type-Options",
//             value: "nosniff",
//           },
//           {
//             key: "X-Frame-Options",
//             value: "DENY",
//           },
//         ],
//       },
//     ];
//   },

//   ...(process.env.NODE_ENV === "development" && {
//     onDemandEntries: {
//       maxInactiveAge: 60 * 1000,
//       pagesBufferLength: 5,
//     },
//   }),

//   logging: {
//     fetches: {
//       fullUrl: process.env.NODE_ENV === "development",
//     },
//   },
};

export default nextConfig;
