"use client";

import React, { useEffect, useState } from "react";
import BlogCardProps from "@/types/BlogTypes";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { ChevronUp, Bookmark, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const BlogCard: React.FC<BlogCardProps> = ({ blog, mode }) => {
  const { id, title, content, upvotes, imageUrl } = blog;
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [voteCount, setVoteCount] = useState(upvotes || 0);
  const [image, setImage] = useState(imageUrl || "");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setVoteCount(upvotes || 0);
  }, [upvotes]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.readAsDataURL(file); // Convert the file to a base64 string
    reader.onloadend = async () => {
      setLoading(true);
      try {
        // Send the base64 image to the backend
        const res = await fetch("/api/updatePostImage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId: id, image: reader.result }), // Send the image and postId
        });
  
        console.log('Response:', res);
  
        if (!res.ok) {
          const error = await res.json();
          console.error('Failed to update post image:', error);
          return;
        }
  
        // Parse the JSON response
        const data = await res.json();
        setImage(data.imageUrl); // Set the image URL in your component's state
      } catch (err) {
        console.error('Error uploading image:', err);
      } finally {
        setLoading(false);
      }
    };
  };

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
        {image && <Image src={image} alt={title} className="w-full h-auto my-4" />}
        <input type="file" onChange={handleImageUpload} />
        {loading && <p>Uploading image...</p>}
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
