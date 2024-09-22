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

            if (!email) {
                return false;
            }

            let existingUser = await prisma.user.findUnique({
                where: { email },
            });

            if (!existingUser) {
                existingUser = await prisma.user.create({
                    data: {
                        email: user.email as string,
                        name: user.name || null,
                    },
                });
            }

            return true;
        },
    },
});

export { handler as GET, handler as POST };
