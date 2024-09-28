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
        // @ts-expect-error: This is necessary because of I dont know.
        async signIn({ user }) {
            const email = user.email;

            if (!email) {
                return false;
            }

            const existingUser = await prisma.user.findUnique({
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
        // @ts-expect-error: This is necessary because of I dont know.
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
