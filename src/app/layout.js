// app/layout.jsx
import "./globals.css";
import Header from "@/components/common/Header";
import ToastProvider from "@/components/common/toastAlert/toastProvider";

export const metadata = {
  title: "The Almaroof Initiative",
  description: "Leadership, Legacy, and Progress",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Header />
        {children}
        <ToastProvider /> {/* Render the ToastProvider here */}
      </body>
    </html>
  );
}
