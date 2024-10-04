// Route to Upvote a Blog
// Left to undo a Upvote.

import { authOptions } from "@/auth";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const postId = parseInt(params.id, 10);

    try {
        const session = await getServerSession(authOptions);

        // Ensure user is authenticated
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = parseInt(session.user.id, 10); // Convert userId to number

        // Check if the user has already upvoted the post
        const existingUpvote = await prisma.upvote.findUnique({
            where: {
                postId_userId: { postId, userId },
            },
        });

        if (existingUpvote) {
            return NextResponse.json({ message: "You have already upvoted this post" }, { status: 400 });
        }

        // Add upvote
        await prisma.upvote.create({
            data: {
                post: { connect: { id: postId } }, 
                user: { connect: { id: userId } }, 
            },
        });

        return NextResponse.json({ message: "Blog Upvoted Successfully" });

    } catch (error) {
        console.error("Error while upvoting:", error);
        return NextResponse.json({ message: "Error while upvoting" }, { status: 500 });
    }
}
