// Route to Upvote a Blog

import { authOptions } from "@/auth";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params } : { params: { id: string} } ) {
    const postId = parseInt(params.id);

    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = parseInt(params.id, 10);
        
        // Check if the user has already upvoted the post.
        const existingUpvote = await prisma.upvote.findUnique({
            where: {
                postId_userId: { postId, userId}
            }
        })

        if (existingUpvote) {
            return NextResponse.json({ message: "You have already upvoted this post" }, { status: 400 });
        }

        // Add upvote
        await prisma.upvote.create({
            data: { postId, userId},
        })

        return NextResponse.json({ message: "Blog Upvoted Successfully"});
        
    } catch (error) {
        console.error(error);
        return NextResponse.json({ messaga: "Error while upvoting"}, { status: 500})
    }
}