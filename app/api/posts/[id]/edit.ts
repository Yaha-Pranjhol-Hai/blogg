import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { authorizePostOwner } from "@/app/middleware/authorizePostOwner";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest, { params }: { params: { id: string }}) {
    const postId = parseInt(params.id);

    // Middleware Used
    const authResponse = await authorizePostOwner(req, NextResponse.next(), postId) 
        if(authResponse.status !== 200){
            return authResponse;
        }

        const { title, content } = await req.json();

        const updatedPost = await prisma.post.update({
            where: { id: postId},
            data: {
                title,
                content,
            }
        });

        return new NextResponse(JSON.stringify(updatedPost), { status: 200 });
    
}