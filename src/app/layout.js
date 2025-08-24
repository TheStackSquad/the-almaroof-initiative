// app/layout.jsx - Production-ready with hydration fixes
import "./globals.css";
import Header from "@/components/common/Header";
import ToastProvider from "@/components/common/toastAlert/toastProvider";
import ReduxProvider from "@/layoutProvider/reduxProvider";
import GlobalErrorBoundary from "@/errorBoundary/globalErrorBoundary";
import ErrorBoundaryInit from "@/errorBoundary/errorBoundaryInit";
import ClientOnlyWrapper from "@/components/common/clientOnlyWrapper";
import HydrationProvider from "@/components/common/hydrationProvider";

export const metadata = {
  title: "The Almaroof Initiative",
  description: "Leadership, Legacy, and Progress",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className="antialiased">
        <GlobalErrorBoundary>
          <ErrorBoundaryInit>
            <HydrationProvider>
              <ReduxProvider>
                {/* Header - potential hydration issue source */}
                <ClientOnlyWrapper fallback={<HeaderSkeleton />}>
                  <Header />
                </ClientOnlyWrapper>

                {/* Main content */}
                <main id="main-content">{children}</main>

                {/* Toast notifications - client-only */}
                <ClientOnlyWrapper>
                  <ToastProvider />
                </ClientOnlyWrapper>
              </ReduxProvider>
            </HydrationProvider>
          </ErrorBoundaryInit>
        </GlobalErrorBoundary>

        {/* Hydration detection script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                window.__HYDRATION_START__ = Date.now();
              }
            `,
          }}
        />
      </body>
    </html>
  );
}

// Header Skeleton Component for SSR
function HeaderSkeleton() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo skeleton */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Navigation skeleton */}
          <div className="hidden md:flex space-x-8">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-16 h-5 bg-gray-200 rounded animate-pulse"
              ></div>
            ))}
          </div>

          {/* Mobile menu button skeleton */}
          <div className="md:hidden w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </header>
  );
}
