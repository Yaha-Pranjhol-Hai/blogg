"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Appbar } from "../components/Appbar";
import BlogCard from "../components/BlogCard";
import { Bookmark, Blog } from "@/types/BlogTypes";

// Remove BookmarkWithPost if not used
interface BookmarkWithDetails extends Bookmark {
    blog: Blog;
}

const BookmarksPage = () => {
    const { data: session } = useSession();
    const [bookmarkedPosts, setBookmarkedPosts] = useState<BookmarkWithDetails[]>([]);

    useEffect(() => {
        const fetchBookmarks = async () => {
            if (!session) return;

            try {
                const response = await fetch(`/api/bookmark/getBookmarks?userId=${session.user.id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch bookmarks");
                }
                const data = await response.json();
                
                const bookmarksWithDetails: BookmarkWithDetails[] = await Promise.all(
                    data.map(async (bookmark: Bookmark) => {
                        const blogResponse = await fetch(`/api/blog/${bookmark.postId}`);
                        const blogData = await blogResponse.json();
                        return {
                            ...bookmark,
                            blog: blogData,
                        };
                    })
                );
                
                setBookmarkedPosts(bookmarksWithDetails);
            } catch (error) {
                console.error("Error fetching bookmarks:", error);
            }
        };

        fetchBookmarks();
    }, [session]);

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
