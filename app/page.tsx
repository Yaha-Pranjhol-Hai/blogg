import Link from "next/link";
import { Appbar } from "./components/Appbar";
import BlogCard from "./components/BlogCard";
import { Blog } from "@/types/BlogTypes";

async function fetchBlogs(): Promise<Blog[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs`);
  if (!res.ok) {
    throw new Error("Failed to fetch blogs");
  }
  return res.json();
}

export default async function Home() {
  const blogs = await fetchBlogs();
  return (
    <div className="min-h-screen flex flex-col">
      <Appbar />
      {/* Hero Section */}
      <section className="flex-grow flex items-center justify-center py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Welcome to Blogg
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                Exploring ideas, one post at a time. Dive into our world of thoughtful content and engaging stories.
              </p>
            </div>
            <div className="space-x-4">
              <Link
                className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
                href="#"
              >
                Read Latest Post
              </Link>
            </div>
          </div>
        </div>
      </section>
{/* 
<section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
  <div className="container mx-auto px-4 md:px-6">
    <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl mb-8 text-center">
      Featured Posts
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} mode="short" />
      ))}
    </div>
  </div>
</section> */}

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2024 MiniBlog. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
