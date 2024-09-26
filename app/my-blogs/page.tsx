"use client"

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Appbar } from "../components/Appbar";
import MyBlogCard from "../components/MyBlogsCard";
interface Blog {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
}

const MyBlogs = () => {
  const { data: session, status } = useSession();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch("/api/my-blogs");
          const data = await response.json();
          // Optionally validate and log data
          if (Array.isArray(data)) {
            setBlogs(data);
          } else {
            console.error("Unexpected data format:", data);
            setBlogs([]);
          }
        } catch (error) {
          console.error("Error fetching blogs:", error);
          setBlogs([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBlogs();
  }, [session]);

  if (status === "loading") return <div>Loading session...</div>;
  if (!session) return <div>Please log in to view your blogs.</div>;
  if (loading) return <div>Loading blogs...</div>;

  return (
    <div>
        <Appbar/>
      <h2 className="text-2xl text-center my-5 font-bold mb-6">My Blogs</h2>
      {blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <div className="">
            <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <MyBlogCard key={blog.id} blog={blog} mode="short" />
          ))}
        </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default MyBlogs;
