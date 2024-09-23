// app/api/blogs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
console.log(session);

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id, 10);

    if (isNaN(userId)) {
        return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    const { title, content } = await req.json();

    if (!title || !content) {
        return NextResponse.json({ message: "Title and content are required" }, { status: 400 });
    }

    try {
        const newPost = await prisma.post.create({
            data: {
                title,
                content,
                authorId: userId,
            },
        });

        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        console.error("Error creating post:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
