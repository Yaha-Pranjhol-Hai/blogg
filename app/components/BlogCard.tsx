"use client";

import React, { useEffect, useState } from "react";
import BlogCardProps from "@/types/BlogTypes";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { ChevronUp, Bookmark, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const BlogCard: React.FC<BlogCardProps> = ({ blog, mode }) => {
  const { id, title, content, upvotes } = blog;
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [voteCount, setVoteCount] = useState(upvotes || 0);

  const router = useRouter();

  useEffect(() => {
    setVoteCount(upvotes || 0);
  }, [upvotes]);

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

  const cardContent = (
    <>
      <CardHeader>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-gray-700 ${mode === "short" ? "line-clamp-3" : ""}`}>
          {mode === "short" ? content.slice(0, 100) + "..." : content}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
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

        {mode === "short" && (
          <Button variant="outline" size="sm" onClick={() => router.push(`/blog/${id}`)}>
            Read More <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </>
  );

  if (mode === "full") {
    return (
      <Link href={`/blog/${id}`} passHref>
        <Card className="w-full lg:w-3/4 xl:w-2/3 mx-auto shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
          {cardContent}
        </Card>
      </Link>
    );
  }

  return (
    <Card className="max-w-sm mx-auto shadow-md hover:shadow-lg transition-shadow duration-300">
      {cardContent}
    </Card>
  );
};

export default BlogCard;
