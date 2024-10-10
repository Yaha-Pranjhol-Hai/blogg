import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// POST - Add a bookmark for a specific post
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const postId = parseInt(params.id, 10); // Ensure postId is parsed

    try {
        const session = await getServerSession(authOptions);

        // Check if session exists and user is logged in
        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = parseInt(session.user.id, 10); // Ensure userId is extracted from session

        // Check if the user has already bookmarked this post
        const existingBookmark = await prisma.bookmark.findUnique({
            where: { postId_userId: { postId, userId } },
        });

        if (existingBookmark) {
            return NextResponse.json({ message: "Already bookmarked" }, { status: 400 });
        }

        // Create a new bookmark
        await prisma.bookmark.create({
            data: { postId, userId },
        });

        return NextResponse.json({ message: "Bookmark successful" }, { status: 201 });
    } catch (error) {
        console.error("Failed to bookmark", error);
        return NextResponse.json({ message: "Failed to bookmark" }, { status: 500 });
    }
}


// DELETE - Remove a bookmark for a specific post
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const postId = parseInt(params.id, 10);

    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = parseInt(session.user.id, 10);

        // Remove the bookmark
        await prisma.bookmark.delete({
            where: { postId_userId: { postId, userId } },
        });

        return NextResponse.json({ message: "Bookmark removed" }, { status: 200 });
    } catch (error) {
        console.error("Failed to remove bookmark", error);
        return NextResponse.json({ message: "Failed to remove bookmark" }, { status: 500 });
    }
}
