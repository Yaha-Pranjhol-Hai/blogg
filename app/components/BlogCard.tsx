"use client";

import React, { useState, useEffect } from "react";
import BlogCardProps from "@/types/BlogTypes";
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

    useEffect(() => {
        const fetchVoteCountAndBookmarkStatus = async () => {
            try {
                const voteResponse = await fetch(`/api/all-blogs/${id}/upvote`);
                if (voteResponse.ok) {
                    const voteData = await voteResponse.json();
                    setVoteCount(voteData.voteCount);
                    setHasUpvoted(voteData.hasUpvoted);
                }

                // Check if the post is bookmarked
                const bookmarkResponse = await fetch(`/api/bookmark/${id}`);
                if (bookmarkResponse.ok) {
                    const bookmarkData = await bookmarkResponse.json();
                    setHasBookmarked(bookmarkData.hasBookmarked);
                }
            } catch (error) {
                console.error("Failed to fetch vote count or bookmark status", error);
            }
        };

        fetchVoteCountAndBookmarkStatus();
    }, [id]);

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
                throw new Error(errorData.message || "Failed to update vote");
            }

            const updatedVoteResponse = await fetch(`/api/all-blogs/${id}/upvote`);
            if (updatedVoteResponse.ok) {
                const updatedData = await updatedVoteResponse.json();
                setVoteCount(updatedData.voteCount);
                setHasUpvoted(!hasUpvoted);
            }
        } catch (err) {
            console.error("Failed to update vote", err);
        }
    };

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

            setHasBookmarked(!hasBookmarked); // Toggle bookmark state
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
