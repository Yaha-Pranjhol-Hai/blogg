"use client";

import useSWR from "swr";
import BlogCard from "../components/BlogCard";
import { Appbar } from "../components/Appbar";
import { Blog } from "@/types/BlogTypes";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AllBlogs() {
    const { data: blogs, mutate, error } = useSWR<Blog[]>('/api/all-blogs', fetcher);

    const handleUpvote = async (blogId: number) => {
        try {
            const response = await fetch(`/api/all-blogs/${blogId}/upvote`, {
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
            <Appbar isBlogPage={true} />
            {/* Masonry Layout */}
            <div className="masonry p-4">
                {Array.isArray(blogs) && blogs.map((blog) => (
                    <div key={blog.id} className="masonry-item">
                        <BlogCard mode="short" blog={blog} onUpvote={handleUpvote} />
                    </div>
                ))}
            </div>
        </div>
    );
}
