import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    // Check if the user is authenticated
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id, 10);
    const blog = await prisma.post.findUnique({
      where: { id: id },
    });

    // If blog is not found, return a 404 error
    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ message: "Internal Server Error for Get request" }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Ensure proper disconnection
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    // Check if the user is authenticated
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id, 10);
    const { title, content } = await req.json();

    // Validate input
    if (!title || !content ) {
      return NextResponse.json({ message: "Invalid input data" }, { status: 400 });
    }

    const updatedBlog = await prisma.post.update({
      where: {
        id: id,
      },
      data: {
        title,
        content,
      },
    });

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ message: "Internal Server Error for Post" }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Ensure proper disconnection
  }
}
