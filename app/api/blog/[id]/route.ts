import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions }  from "../../auth/authOptions";
import { Blog } from "@/types/BlogTypes";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string}}) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const id = parseInt(params.id, 10);
    const blog = await prisma.post.findUnique({
      where: { id: id },
    })

    if(blog) {
      return NextResponse.json(blog);
    }
    else {
      return NextResponse.json({message: 'Internal Server Error'});
    }
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ message:'Internal Server error'}, { status: 404});
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string}}) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const id = parseInt(params.id, 10);
    const { title, content, imageUrl } = await req.json();
    const updatedBlog: Blog = await prisma.post.update({
      where: {
        id: id,
      },
      data: {
        title,content, imageUrl
      }
    })
    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error(" error:", error);
    return NextResponse.json({ message: "Internal Server Error"}, { status: 404})
  }
}