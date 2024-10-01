"use client";

import React, { useState } from "react";
import BlogCardTypes from "@/types/BlogTypes";
import { Button } from "./ui/button";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { ChevronUp, Bookmark } from "lucide-react";


interface BlogCardProps extends BlogCardTypes {
  onUpvote: (blogId: number) => void; 
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, onUpvote }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleReadMore = () => {
    window.location.href = `/blog/${blog.id}`;
  };

  return (
    <Card className="max-w-sm mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">{blog.title}</CardTitle>
      </CardHeader>
      <CardContent>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => onUpvote(blog.id)}>
            <ChevronUp className="mr-1 h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleBookmark}>
            <Bookmark
              className={`mr-1 h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
            />
            {isBookmarked ? "Saved" : "Save"}
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-black"
          onClick={handleReadMore}
        >
          Read More
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;

