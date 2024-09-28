"use client";

import { useEffect, useState } from "react";
import { getSession } from "next-auth/react"; // Correct way to get session client-side
import { Post } from "@prisma/client"; 
import { Appbar } from "../components/Appbar";
import MyBlogCard from "../components/MyBlogsCard";

const MyBlogsPage = () => {
  const [blogs, setBlogs] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      const session = await getSession(); // Correct client-side session fetching

      if (!session) {
        setError("Please log in to view your blogs.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/my-blogs"); // No need to pass authorId in the query string
        if (!response.ok) throw new Error("Failed to fetch blogs");
        const data = await response.json();
        setBlogs(data);
      } catch (err) {
        const errorMessage = (err as Error).message || "An unknown error occurred.";
        console.error("Error fetching blogs:", errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Appbar />
      <h2 className="text-2xl text-center my-5 font-bold mb-6">My Blogs</h2>
      {blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <MyBlogCard key={blog.id} blog={blog} mode="short" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBlogsPage;
