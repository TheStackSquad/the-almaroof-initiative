// app/layout.js
import "./globals.css";
import Header from "@/components/common/Header";
import HeaderSkeleton from "@/components/common/headerSkeleton";
import ToastProvider from "@/components/common/toastAlert/toastProvider";
import ReduxProvider from "@/layoutProvider/reduxProvider";
import GlobalErrorBoundary from "@/errorBoundary/globalErrorBoundary";
import ErrorBoundaryInit from "@/errorBoundary/errorBoundaryInit";
import ClientOnlyWrapper from "@/components/common/clientOnlyWrapper";
import HydrationProvider from "@/components/common/hydrationProvider";
import RealUserMonitoring from "@/components/performance/realUserMonitoring";

export const metadata = {
  title: "The Almaroof Initiative",
  description: "Leadership, Legacy, and Progress",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        {/* Performance optimization meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      </head>

      <body className="antialiased">
    
          <GlobalErrorBoundary>
            <ErrorBoundaryInit>
              <HydrationProvider>
                <ReduxProvider>
               
                    {/* Header with loading skeleton */}
                    <ClientOnlyWrapper fallback={<HeaderSkeleton />}>
                      <Header />
                    </ClientOnlyWrapper>

                    {/* Main content area */}
                    <main id="main-content" className="min-h-screen">
                      {children}
                    </main>

                    {/* Toast notifications - client only */}
                    <ClientOnlyWrapper>
                      <ToastProvider />
                    </ClientOnlyWrapper>

                    {/* Performance monitoring - client only */}
                    <ClientOnlyWrapper>
                      <RealUserMonitoring />
                    </ClientOnlyWrapper>
              
                </ReduxProvider>
              </HydrationProvider>
            </ErrorBoundaryInit>
          </GlobalErrorBoundary>
   
      </body>
    </html>
  );
}
