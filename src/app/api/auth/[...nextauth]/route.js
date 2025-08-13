// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Here you would add your logic to check the credentials
        // For example, looking up a user in your database
        const user = { id: "1", name: "J Smith", email: "jsmith@example.com" };
        if (user) {
          return user;
        } else {
          return null; // Return null if user is not found
        }
      },
    }),
    // Add other providers here if needed
  ],
  // You can add other configurations like callbacks, pages, etc., here.
});

// Export the handler for both GET and POST requests
export { handler as GET, handler as POST };
