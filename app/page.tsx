"use client";

import Link from "next/link";
import { Appbar } from "./components/Appbar";
import { Blog } from "@/types/BlogTypes";
import { useEffect, useState } from "react";
import BlogCard from "./components/BlogCard";
import { Mail, Github, Linkedin, Copyright } from "lucide-react"
import { Button } from "./components/ui/button";

async function fetchBlogs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/my-blogs`);
  if (!res.ok) {
    throw new Error("Failed to fetch blogs");
  }
  return res.json();
}

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const blogsData = await fetchBlogs();
        setBlogs(blogsData);
      } catch (error) {
        console.error(error);
      }
    };
    loadBlogs();
  }, []);

  const onUpvote = (blogId: number) => {
    console.log("Upvoted blog with ID:", blogId);
    // You can add further functionality here, like making an API call to update the upvote count
  };

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
      
      {/* Featured Posts Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl mb-8 text-center">
            Featured Posts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} mode="short" onUpvote={onUpvote} />
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-50 dark:bg-gray-900 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">About Blogg</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Blogg is a platform for sharing insightful articles and stories. We aim to provide thoughtful content and engaging narratives on a wide range of topics.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <nav className="grid grid-cols-2 gap-2">
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">Home</Link>
              <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">About</Link>
              <Link href="/blogs" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">All Blogs</Link>
              <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">Contact</Link>
            </nav>
          </div>
        </div>
        <div className="my-8" />
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <Link href="mailto:jainpranjal30112002@gmail.com" aria-label="Email Pranjal Jain">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                <Mail className="h-5 w-5 mr-2" />
                Email
              </Button>
            </Link>
            <Link href="https://github.com/Yaha-Pranjhol-Hai" aria-label="Pranjal Jain's GitHub">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                <Github className="h-5 w-5 mr-2" />
                GitHub
              </Button>
            </Link>
            <Link href="https://www.linkedin.com/in/yaha-pranjhol-hai/" aria-label="Pranjal Jain's LinkedIn">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                <Linkedin className="h-5 w-5 mr-2" />
                LinkedIn
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
            <Copyright className="h-4 w-4 mr-1" />
            {currentYear} Blogg by Pranjal Jain. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
    </div>
  );
}
