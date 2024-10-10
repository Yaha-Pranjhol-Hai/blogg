"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Appbar } from "../components/Appbar";
import BlogCard from "../components/BlogCard";
import { Blog } from "@/types/BlogTypes";

const BookmarksPage = () => {
    const { data: session } = useSession();
    const [bookmarkedPosts, setBookmarkedPosts] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBookmarks = async () => {
            if (!session?.user?.id) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Fetch the bookmarks
                const response = await fetch(`/api/bookmark/${session.user.id}/getBookmarks`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch bookmarks. Status: ${response.status}`);
                }

                const data = await response.json();

                setBookmarkedPosts(data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookmarks();
    }, [session]);

    if (loading) {
        return (
            <div>
                <Appbar />
                <div className="container mx-auto p-4">
                    <h1 className="text-2xl font-bold mb-4">Loading your bookmarks...</h1>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Appbar />
                <div className="container mx-auto p-4">
                    <h1 className="text-2xl font-bold mb-4">Error: {error}</h1>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Appbar />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Your Bookmarked Posts</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bookmarkedPosts.length === 0 ? (
                        <p>No bookmarks found.</p>
                    ) : (
                        bookmarkedPosts.map((blog) => (
                            <BlogCard 
                                key={blog.id} 
                                blog={blog}
                                mode="short" 
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookmarksPage;
