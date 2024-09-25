// app/api/blogs/route.ts
import { NextResponse } from 'next/server';

const blogs = [
    {
      id: "1",
      title: "First Blog Post",
      excerpt: "This is the excerpt of the first blog post...",
      content: "This is the full content of the first blog post.",
      // imageUrl: "https://via.placeholder.com/150",
    },
    {
      id: "2",
      title: "Second Blog Post",
      excerpt: "This is the excerpt of the second blog post...",
      content: "This is the full content of the second blog post.",
      // imageUrl: "https://via.placeholder.com/150",
    },
    {
      id: "3",
      title: "Third Blog Post",
      excerpt: "This is the excerpt of the third blog post...",  // Corrected
      content: "This is the full content of the third blog post.",  // Corrected
      // imageUrl: "https://via.placeholder.com/150",
    },
    // Add more blogs or fetch from your database
  ];
  

export async function GET() {
  return NextResponse.json(blogs);
}

export async function GET_BY_ID(req: Request, { params }: { params: { id: string } }) {
  const blog = blogs.find((b) => b.id === params.id);
  if (blog) {
    return NextResponse.json(blog);
  } else {
    return NextResponse.json({ message: 'Not Found' }, { status: 404 });
  }
}
