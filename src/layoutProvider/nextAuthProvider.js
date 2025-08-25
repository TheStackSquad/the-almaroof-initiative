//src/layoutProvider/nextAuthProvider.js

"use client";

import { SessionProvider } from "next-auth/react";

/**
 * NextAuthProvider wraps the application with NextAuth's SessionProvider.
 *
 * This provider makes the session object available to all client components
 * nested within it, allowing you to use hooks like `useSession` to
 * access authentication state.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be wrapped.
 * @param {Object} props.session - Optional, but typically provided by Next.js.
 */
export default function NextAuthProvider({ children, session }) {
  // The SessionProvider takes care of the client-side session management.
  // It handles fetching the session on the client and keeps it updated.
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
