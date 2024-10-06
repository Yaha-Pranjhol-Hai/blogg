"use client";

import React, { useState } from "react";
import BlogCardProps from "@/types/BlogTypes";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { ChevronUp, Bookmark, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const BlogCard: React.FC<BlogCardProps> = ({ blog, mode }) => {
    const { id, title, content, upvotes, imageUrl } = blog;
    const [hasUpvoted, setHasUpvoted] = useState(false);
    const [voteCount, setVoteCount] = useState(upvotes || 0);
    const router = useRouter();

    const handleUpvote = async () => {
        if (hasUpvoted) return;
        try {
            const response = await fetch(`/api/all-blogs/${id}/upvote`, { method: "POST" });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to upvote");
            }
            setVoteCount((prevCount) => prevCount + 1);
            setHasUpvoted(true);
        } catch (err) {
            console.error("Failed to upvote", err);
        }
    };

    return (
        <Card className="card"> {/* Apply card styles */}
            <CardHeader>
                <CardTitle className="text-xl font-bold">{title}</CardTitle>
                {imageUrl && (
                    <Image
                        src={imageUrl}
                        alt={title}
                        width={600}
                        height={400}
                        quality={100}
                        className="w-full h-auto object-cover mb-4"
                    />
                )}
            </CardHeader>
            <CardContent>
                <p className={`text-gray-700 ${mode === "short" ? "line-clamp-3" : ""}`}>
                    {mode === "short" ? content.slice(0, 100) + "..." : content}
                </p>
            </CardContent>
            <CardFooter className="card-footer">
                <Button variant="outline" size="sm" onClick={handleUpvote} disabled={hasUpvoted}>
                    <ChevronUp className="mr-1 h-4 w-4" />
                    {voteCount > 0 ? `${voteCount}` : "0"} Upvotes
                </Button>
                <Button variant="outline" size="sm">
                    <Bookmark className="mr-1 h-4 w-4" />
                    Save
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
