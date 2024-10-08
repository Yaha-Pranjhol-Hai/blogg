import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = parseInt(session.user.id, 10);

        const bookmarks = await prisma.bookmark.findMany({
            where: { userId },
            include: {
                post: true,
            },
        });

        return NextResponse.json(bookmarks);
    } catch (error) {
        console.error("Error while fetching bookmarks:", error);
        return NextResponse.json({ message: "Error while fetching bookmarks" }, { status: 500 });
    }
}
