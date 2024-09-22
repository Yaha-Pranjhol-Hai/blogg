import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const email = user.email;

      // Ensure email is not null or undefined before querying the database
      if (!email) {
        return false; // Stop sign-in if no email is provided
      }

      // Find user by email (since email is unique)
      let existingUser = await prisma.user.findUnique({
        where: { email },  // Prisma now recognizes email as unique
      });

      // If the user doesn't exist, create a new user
      if (!existingUser) {
        existingUser = await prisma.user.create({
          data: {
            email: user.email as string, // Use `as string` to cast `email` safely
            name: user.name || null,     // Handle the case where name might be undefined
          },
        });
      }

      return true;
    },
  },
});

export { handler as GET, handler as POST };
