"use client";

import React, { useEffect, useState } from "react";
import BlogCardProps from "@/types/BlogTypes";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { ChevronUp, Bookmark } from "lucide-react";

const BlogCard: React.FC<BlogCardProps> = ({ blog, mode, onUpvote }) => {
  // Destructure the properties from the blog object
  const { id, title, content, upvotes } = blog;
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [voteCount, setVoteCount] = useState(upvotes || 0);

  useEffect(() => {
    setVoteCount(upvotes || 0);
  }, [upvotes]);

  const handleReadMore = () => {
    window.location.href = `/blog/${id}`;
  };

  const handleUpvote = async () => {
    if (hasUpvoted) {
      console.warn("You have already upvoted this blog.");
      return; // Prevent multiple upvotes
    }

    try {
      const response = await fetch(`/api/all-blogs/${id}/upvote`, {
        method: "POST",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upvote");
      }
      setVoteCount((prevCount) => prevCount + 1);
      setHasUpvoted(true);

      // Call the parent callback if provided
      if (onUpvote) {
        await onUpvote(id);
      }
    } catch (err) {
      console.error("Failed to upvote", err);
    }
  };

  return (
    <Card className="max-w-sm mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Show excerpt or full content based on mode */}
        <p>{mode === "short" ? content.slice(0, 100) + "..." : content}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleUpvote} disabled={hasUpvoted}>
            <ChevronUp className="mr-1 h-4 w-4" />
            {voteCount > 0 ? `${voteCount}` : "0"} Upvotes 
          </Button>
          <Button variant="outline" size="sm">
            <Bookmark className="mr-1 h-4 w-4" />
            Save
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={handleReadMore}>
          Read More
        </Button>
      </CardFooter>
    </Card>
  );
  
};

export default BlogCard;
