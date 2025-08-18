// //src.app/comunnity/online-services/services/page.js

// "use client";

// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import { useSelector } from "react-redux";
// import dynamic from "next/dynamic";
// import { Spinner } from "@nextui-org/react";
// import { RouteValidator } from "@/utils/route/routeValidator";
// import Link from "next/link";

// export default function ServicePage({ params }) {
//   const router = useRouter();
//   const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
//   const validator = new RouteValidator(params.params);
//   const validation = validator.validate();

//   // Authentication check
//   useEffect(() => {
//     if (!isAuthenticated && !isLoading) {
//       router.push(
//         `/community/online-services/protected-route?redirect=${encodeURIComponent(
//           `/community/online-services/${params.params.join("/")}`
//         )}`
//       );
//     }
//   }, [isAuthenticated, isLoading, router, params.params]);

//   // Handle loading state
//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Spinner size="lg" />
//       </div>
//     );
//   }

//   // Handle invalid routes
//   if (!validation.isValid) {
//     return (
//       <ServiceError
//         error={validation.error || "Invalid service route"}
//         redirectUrl="/community/online-services"
//       />
//     );
//   }

//   // Dynamic component loading
//   const ServiceComponent = dynamic(
//     () =>
//       import(
//         `@/components/community/service-pages/${validation.actionConfig.component}`
//       ),
//     {
//       loading: () => (
//         <div className="min-h-screen flex items-center justify-center">
//           <Spinner size="lg" />
//         </div>
//       ),
//       ssr: false,
//     }
//   );

//   return (
//     <main className="service-page-container">
//       <ServiceComponent
//         serviceId={validation.serviceId}
//         actionId={validation.actionId}
//         serviceConfig={validation.serviceConfig}
//         actionConfig={validation.actionConfig}
//       />
//     </main>
//   );
// }

// function ServiceError({ error, redirectUrl }) {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
//       <div className="text-center p-8 max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg">
//         <h1 className="text-3xl font-bold text-red-600 dark:text-red-500 mb-4">
//           Service Unavailable
//         </h1>
//         <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
//         <Link
//           href={redirectUrl}
//           className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
//         >
//           Back to Services
//         </Link>
//       </div>
//     </div>
//   );
// }