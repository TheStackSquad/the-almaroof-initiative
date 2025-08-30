// // src/components/community/local-services/hooks/useServiceAuth.js

// "use client";

// import { useState, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import { useSelector } from "react-redux";
// import { RouteValidator } from "@/utils/route/routeValidator";

// export const useServiceAuth = () => {
//   const router = useRouter();
//   const [authLoading, setAuthLoading] = useState(false);

//   // Read current auth state (session checking happens at app level)
//   const { isAuthenticated, sessionChecked } = useSelector(
//     (state) => state.auth
//   );

//   const handleServiceClick = useCallback(
//     async (service) => {
//       console.log("🚀 Service access requested for:", service.name);

//       setAuthLoading(true);

//       try {
//         // Simple routing based on current auth state
//         // No session checking needed - it's handled at app level
//         if (isAuthenticated && sessionChecked) {
//           const targetUrl = RouteValidator.generateServiceUrl(service.id);
//           console.log("✅ Authenticated - Direct navigation to:", targetUrl);
//           router.push(targetUrl);
//         } else {
//           const targetUrl = RouteValidator.generateServiceUrl(service.id);
//           const loginRedirectUrl = RouteValidator.generateLoginUrl(targetUrl);
//           console.log(
//             "🔀 Not authenticated - Redirect to login:",
//             loginRedirectUrl
//           );
//           router.push(loginRedirectUrl);
//         }
//       } catch (error) {
//         console.error("💥 Navigation error:", error);
//         // Fallback to login
//         const targetUrl = RouteValidator.generateServiceUrl(service.id);
//         const loginRedirectUrl = RouteValidator.generateLoginUrl(targetUrl);
//         router.push(loginRedirectUrl);
//       } finally {
//         setAuthLoading(false);
//       }
//     },
//     [router, isAuthenticated, sessionChecked]
//   );

//   return {
//     authLoading,
//     handleServiceClick,
//   };
// };
