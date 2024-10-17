"use client";

import React, { useState, useEffect } from "react";
import { BlogCardProps } from "@/types/BlogTypes";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { ChevronUp, Bookmark, BookmarkCheck, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";

const BlogCard: React.FC<BlogCardProps> = ({ blog, mode }) => {
    const { id, title, content, imageUrl } = blog;
    const [voteCount, setVoteCount] = useState(blog.upvotes || 0);
    const [hasUpvoted, setHasUpvoted] = useState(false);
    const [hasBookmarked, setHasBookmarked] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();

    // Fetch vote count and bookmark status on page load or refresh
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch vote count
                const voteResponse = await fetch(`/api/all-blogs/${id}/upvote`);
                if (voteResponse.ok) {
                    const voteData = await voteResponse.json();
                    setVoteCount(voteData.voteCount);
                    setHasUpvoted(voteData.hasUpvoted);
                }

                // Fetch bookmark status if user is logged in
                if (session?.user?.id) {
                    const bookmarkResponse = await fetch(`/api/bookmark/${id}`);
                    if (bookmarkResponse.ok) {
                        const bookmarkData = await bookmarkResponse.json();
                        setHasBookmarked(bookmarkData.hasBookmarked);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch vote count or bookmark status", error);
            }
        };

        fetchData();
    }, [id, session]);

    // Handle upvote logic
    const handleUpvote = async () => {
        if (!session) {
            signIn();
            return;
        }

        try {
            const method = hasUpvoted ? "DELETE" : "POST";
            const response = await fetch(`/api/all-blogs/${id}/upvote`, { method });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update upvote");
            }

            // Update the UI for upvote count and status
            setHasUpvoted(!hasUpvoted);
            setVoteCount((prevCount) => (hasUpvoted ? prevCount - 1 : prevCount + 1));
        } catch (err) {
            console.error("Failed to update upvote", err);
        }
    };

    // Handle bookmarking logic
    const handleBookmark = async () => {
        if (!session) {
            signIn();
            return;
        }

        try {
            const method = hasBookmarked ? "DELETE" : "POST";
            const response = await fetch(`/api/bookmark/${id}`, { method });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update bookmark");
            }

            // Toggle the bookmark state in the UI
            setHasBookmarked(!hasBookmarked);
        } catch (err) {
            console.error("Failed to update bookmark", err);
        }
    };

    return (
        <Card className="card">
            <CardHeader>
                <CardTitle className="text-xl font-bold">{title}</CardTitle>
                {imageUrl && (
                    <Image
                        src={imageUrl}
                        alt={title}
                        width={600}
                        height={400}
                        quality={100}
                        priority
                        className="w-full h-auto object-cover mb-4"
                    />
                )}
            </CardHeader>
            <CardContent>
                <p className={`text-gray-700 ${mode === "short" ? "line-clamp-3" : ""}`}>
                    {mode === "short" ? content.slice(0, 100) + "..." : content}
                </p>
            </CardContent>
            <CardFooter className="card-footer flex flex-wrap gap-2 lg:gap-4 justify-center sm:justify-start">
                {/* Upvote Button */}
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleUpvote}
                    className="flex items-center gap-2"
                >
                    <ChevronUp className="h-4 w-4" />
                    {voteCount > 0 ? voteCount : "0"}
                    <span className="border-l border-gray-300 pl-2">
                        {hasUpvoted ? "Undo Upvote" : "Upvote"}
                    </span>
                </Button>

                {/* Bookmark Button */}
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleBookmark}
                    className="flex items-center gap-2"
                >
                    {hasBookmarked ? (
                        <>
                            <BookmarkCheck className="h-4 w-4" /> Bookmarked
                        </>
                    ) : (
                        <>
                            <Bookmark className="h-4 w-4" /> Save
                        </>
                    )}
                </Button>

                {mode === "short" && (
                    <Button variant="outline" size="sm" onClick={() => router.push(`/blog/${id}`)}>
                        Read More <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
};

export default BlogCard;
