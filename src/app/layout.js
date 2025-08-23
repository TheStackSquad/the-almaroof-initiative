// app/layout.jsx
import "./globals.css";
import Header from "@/components/common/Header";
import ToastProvider from "@/components/common/toastAlert/toastProvider";
import ReduxProvider from "@/layoutProvider/reduxProvider";
//Step 1: Import global error boundary for app-wide error protection
import GlobalErrorBoundary from "@/errorBoundary/globalErrorBoundary";
//Step 1: Import error boundary initialization
import ErrorBoundaryInit from "@/errorBoundary/errorBoundaryInit";

export const metadata = {
  title: "The Almaroof Initiative",
  description: "Leadership, Legacy, and Progress",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
      
        <GlobalErrorBoundary>
          <ErrorBoundaryInit>
            <ReduxProvider>
              <Header />
              {children}
              <ToastProvider />
            </ReduxProvider>
          </ErrorBoundaryInit>
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
