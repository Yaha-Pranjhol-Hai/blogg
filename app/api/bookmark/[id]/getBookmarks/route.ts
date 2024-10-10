import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET - Fetch all bookmarks for a user
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.id !== params.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = parseInt(params.id, 10);

        // Fetch bookmarks for the user and include the associated post
        const bookmarks = await prisma.bookmark.findMany({
            where: { userId },
            include: { post: true },
        });
        console.log("Bookmarks found:", bookmarks); // Log what bookmarks are found
        

        if (!bookmarks || bookmarks.length === 0) {
            return NextResponse.json([], { status: 200 }); // Return an empty array if no bookmarks found
        }

        // Format the bookmark data (optional step, depending on what you need on the client side)
        const bookmarkData = bookmarks.map((bookmark) => ({
            ...bookmark.post, // Spread post details into the response
            hasBookmarked: true, // Include a flag indicating that it's bookmarked
        }));

        return NextResponse.json(bookmarkData, { status: 200 });
    } catch (error) {
        console.error("Error fetching bookmarks:", error);
        return NextResponse.json({ message: "Error fetching bookmarks" }, { status: 500 });
    }
}
