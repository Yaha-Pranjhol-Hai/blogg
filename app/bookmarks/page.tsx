"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Appbar } from "../components/Appbar";
import BlogCard from "../components/BlogCard";
import { Bookmark, Blog } from "@/types/BlogTypes";

interface BookmarkWithDetails extends Bookmark {
    blog: Blog;
}

const BookmarksPage = () => {
    const { data: session, status } = useSession();
    const [bookmarkedPosts, setBookmarkedPosts] = useState<BookmarkWithDetails[]>([]);
    const [loading, setLoading] = useState(true);  // Loading state
    const [error, setError] = useState<string | null>(null);  // Error state

    useEffect(() => {
        const fetchBookmarks = async () => {
            if (!session?.user?.id) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);  // Reset error before fetch
                
                const response = await fetch(`/api/bookmark/${session.user.id}/getBookmarks`);
                if (!response.ok) {
                    throw new Error("Failed to fetch bookmarks");
                }
                
                const data = await response.json();
                
                const bookmarksWithDetails: BookmarkWithDetails[] = await Promise.all(
                    data.map(async (bookmark: Bookmark) => {
                        const blogResponse = await fetch(`/api/blog/${bookmark.postId}`);
                        if (!blogResponse.ok) {
                            throw new Error("Failed to fetch blog details");
                        }
                        const blogData = await blogResponse.json();
                        return {
                            ...bookmark,
                            blog: blogData,
                        };
                    })
                );
                
                setBookmarkedPosts(bookmarksWithDetails);
            } catch (error: any) {
                console.error("Error fetching bookmarks:", error);
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
                        bookmarkedPosts.map((bookmark) => (
                            <BlogCard 
                                key={bookmark.postId} 
                                blog={bookmark.blog} 
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
