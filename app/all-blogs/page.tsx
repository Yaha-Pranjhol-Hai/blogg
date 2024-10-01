"use client";

import useSWR from "swr";
import { useState } from "react";
import { Post } from "@prisma/client"; 
import BlogCard from "../components/BlogCard";

// Fetcher function using fetch API
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AllBlogs() {
    const [sortBy, setSortBy] = useState<"upvotes" | "createdAt">("createdAt");
    const { data: blogs, mutate, error } = useSWR<Post[]>(`/api/all-blogs?sortBy=${sortBy}`, fetcher);

    const handleUpvote = async (blogId: number) => {
        try {
            const response = await fetch(`/api/all-blogs/${blogId}`, {
                method: 'POST',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to upvote');
            }
            mutate(); // Re-fetch blogs to update the UI with the new upvote
        } catch (err) {
            console.error("Failed to upvote", err);
        }
    };

    if (error) return <div>Failed to load blogs: {error.message}</div>;
    if (!blogs) return <div>Loading...</div>;

    return (
        <div>
            {/* Sorting Options */}
            <div className="mb-4">
                <button onClick={() => setSortBy("createdAt")} className="mr-2 p-2 border border-gray-300 rounded">
                    Sort by Date
                </button>
                <button onClick={() => setSortBy("upvotes")} className="p-2 border border-gray-300 rounded">
                    Sort by Upvotes
                </button>
            </div>

            {/* Blog List using BlogCard component */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {blogs.map((blog: Post) => (
                    <BlogCard key={blog.id} blog={blog} mode="short" onUpvote={handleUpvote} />
                ))}
            </div>
        </div>
    );
}
