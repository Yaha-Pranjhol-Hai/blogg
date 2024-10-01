// This file gets all blogs for the un-authenticated users by upvotes.

import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest){
    const { searchParams } = new URL(req.url);
    const sortBy = searchParams.get("sortBy") || "createdAt";

    try {
        const posts = await prisma.post.findMany({
            orderBy: sortBy === "upvotes"
              ? { upvotes: { _count: "desc" } } // It is not a scaler function this aggregation is used for it.
            : { createdAt: "desc" },
            include: { author: true },
        });

        return NextResponse.json(posts);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error Fetching Posts" }, { status: 500})
    }
}