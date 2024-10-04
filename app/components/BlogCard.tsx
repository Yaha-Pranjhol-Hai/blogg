"use client";

import React from "react";
import BlogCardProps from "@/types/BlogTypes";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { ChevronUp, Bookmark } from "lucide-react";

const BlogCard: React.FC<BlogCardProps> = ({ blog, mode, onUpvote }) => {
  // Destructure the properties from the blog object
  const { id, title, content, upvotes } = blog;

  const handleReadMore = () => {
    window.location.href = `/blog/${id}`;
  };

  const handleUpvote = async () => {
    if (onUpvote) {
      await onUpvote(id);
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
        {/* Display the number of upvotes */}
        <p>{upvotes || 0} Upvotes</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleUpvote}>
            <ChevronUp className="mr-1 h-4 w-4" />
            Upvote
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
