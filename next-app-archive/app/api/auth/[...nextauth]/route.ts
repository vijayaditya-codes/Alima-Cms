import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "MOCK_GOOGLE_CLIENT_ID",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "MOCK_GOOGLE_CLIENT_SECRET",
    }),
    CredentialsProvider({
      id: "google-mock",
      name: "Google Mock Authentication",
      credentials: {
        name: { label: "Name", type: "text" },
        email: { label: "Email", type: "text" },
        image: { label: "Image URL", type: "text" },
      },
      async authorize(credentials) {
        if (credentials) {
          return {
            id: "mock-user-123",
            name: credentials.name || "Sarah Jenkins",
            email: credentials.email || "sarah.jenkins@alima.edu",
            image: credentials.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "alima-development-secret-key-32-chars-long-or-more",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
