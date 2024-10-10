import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET - Fetch bookmarks for a specific user
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.id !== params.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = parseInt(params.id, 10);

        // Fetch bookmarks for the user
        const bookmarks = await prisma.bookmark.findMany({
            where: { userId },
            include: {
                post: true, // Include related post data
            },
        });

        // Return bookmark data with hasBookmarked set to true
        const bookmarkData = bookmarks.map((bookmark) => ({
            ...bookmark.post,
            hasBookmarked: true,
        }));

        return NextResponse.json(bookmarkData);
    } catch (error) {
        console.error("Error fetching bookmarks:", error);
        return NextResponse.json({ message: "Error fetching bookmarks" }, { status: 500 });
    }
}
