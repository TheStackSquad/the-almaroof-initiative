// app/layout.jsx
import "./globals.css";
import Header from "@/components/common/Header";

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
      </body>
    </html>
  );
}
