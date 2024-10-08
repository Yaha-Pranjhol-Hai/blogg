import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const postId = parseInt(params.id, 10);

    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = parseInt(session.user.id, 10);

        const existingBookmark = await prisma.bookmark.findUnique({
            where: { postId_userId: { postId, userId } },
        });

        return NextResponse.json({ hasBookmarked: !!existingBookmark });
    } catch (error) {
        console.error("Error while checking bookmark status:", error);
        return NextResponse.json({ message: "Error while checking bookmark status" }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const postId = parseInt(params.id, 10);

    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = parseInt(session.user.id, 10);

        const existingBookmark = await prisma.bookmark.findUnique({
            where: { postId_userId: { postId, userId } },
        });

        if (existingBookmark) {
            return NextResponse.json({ message: "Already bookmarked" }, { status: 400 });
        }

        await prisma.bookmark.create({
            data: {
                postId,
                userId,
            },
        });

        return NextResponse.json({ message: "Post bookmarked successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error while bookmarking:", error);
        return NextResponse.json({ message: "Error while bookmarking" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const postId = parseInt(params.id, 10);

    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = parseInt(session.user.id, 10);

        const existingBookmark = await prisma.bookmark.findUnique({
            where: { postId_userId: { postId, userId } },
        });

        if (!existingBookmark) {
            return NextResponse.json({ message: "Bookmark not found" }, { status: 404 });
        }

        await prisma.bookmark.delete({
            where: { postId_userId: { postId, userId } },
        });

        return NextResponse.json({ message: "Bookmark removed" }, { status: 200 });
    } catch (error) {
        console.error("Error while removing bookmark:", error);
        return NextResponse.json({ message: "Error while removing bookmark" }, { status: 500 });
    }
}