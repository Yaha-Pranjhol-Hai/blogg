// Route to manage bookmarks

import { authOptions } from "@/auth";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET - Fetch bookmarks for a specific user
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = parseInt(session.user.id, 10);

        // Fetch bookmarks for the logged-in user
        const bookmarks = await prisma.bookmark.findMany({
            where: { userId },
            include: {
                post: true, // Include related post data if needed
            },
        });

        return NextResponse.json(bookmarks);
    } catch (error) {
        console.error("Error fetching bookmarks:", error);
        return NextResponse.json({ message: "Error fetching bookmarks" }, { status: 500 });
    }
}

// POST - Add a bookmark for a specific post
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const postId = parseInt(params.id, 10);

    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = parseInt(session.user.id, 10);

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
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
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
