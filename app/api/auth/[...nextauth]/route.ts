// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        //@ts-ignore
        async signIn({ user }) {
            const email = user.email;

            if (!email) {
                return false;
            }

            let existingUser = await prisma.user.findUnique({
                where: { email },
            });

            if (!existingUser) {
                await prisma.user.create({
                    data: {
                        email: user.email as string,
                        name: user.name || null,
                    },
                });
            }

            return true;
        },
        // @ts-ignore
        async session({ session }) {
            if (session.user) {
                const userRecord = await prisma.user.findUnique({
                    where: { email: session.user.email as string },
                });
                if (userRecord) {
                    session.user.id = userRecord.id.toString(); 
                }
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
