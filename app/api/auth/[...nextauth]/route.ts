import NextAuth, { NextAuthOptions, User, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user }: { user: User }) {
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
        async session({ session }: { session: Session }) {
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

// Create the NextAuth handler with the defined options
const handler = NextAuth(authOptions);

// Exporting the handler for API routes
export { handler as GET, handler as POST };
