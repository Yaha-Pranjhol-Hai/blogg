// Route to Upvote a Blog

import { authOptions } from "@/auth";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const postId = parseInt(params.id, 10);

    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id ? parseInt(session.user.id, 10) : null;

        const upvotes = await prisma.upvote.count({
            where: { postId },
        });

        const hasUpvoted = userId
            ? !!(await prisma.upvote.findUnique({
                where: {
                    postId_userId: { postId, userId },
                },
            }))
            : false;

        return NextResponse.json({ voteCount: upvotes, hasUpvoted });

    } catch (error) {
        console.error("Error fetching vote count:", error);
        return NextResponse.json({ message: "Error fetching vote count" }, { status: 500 });
    }
}


export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const postId = parseInt(params.id, 10);

    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = parseInt(session.user.id, 10); // Convert userId to number

        const existingUpvote = await prisma.upvote.findUnique({
            where: {
                postId_userId: { postId, userId },
            },
        });

        if (existingUpvote) {
            await prisma.upvote.delete({
                where: {
                    postId_userId: { postId, userId }
                }
            })
            return NextResponse.json({ message: "Upvote Removed" }, { status: 200 });
        } else {
            await prisma.upvote.create({
                data: {
                    post: { connect: { id: postId } },
                    user: { connect: { id: userId } },
                },
            });
        }

        return NextResponse.json({ message: "Blog Upvoted Successfully" });

    } catch (error) {
        console.error("Error while upvoting:", error);
        return NextResponse.json({ message: "Error while upvoting" }, { status: 500 });
    }
}
