import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [GitHub,
        GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  })],
  callbacks: {
    session({ session, user } : { session: any, user: any }) {
      if (session?.user) {
        session.user.id = user.id;
        session.user.role = user.role;
        session.user.emailVerified = user.emailVerified;
        session.user.savedBookings = user.savedBookings || [];
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  
});

import type { Session as NextAuthSession } from "next-auth";

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
  emailVerified: Date | null;
  savedBookings: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Session extends NextAuthSession {
  user: User;
}

// export type User = typeof Session.user;
// export type User = typeof auth.$Infer.Session.user;