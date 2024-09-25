import Link from "next/link";
import React from "react";
import BlogTypes from "@/types/BlogTypes";

const truncateText = (text: string, limit: number) => {
  if (text.length > limit) {
    return text.substring(0, limit) + "...";
  }
  return text;
};

const BlogCard: React.FC<BlogTypes> = ({ blog, mode }) => {
  return (
    <div className="flex flex-col space-y-2">
      {/* <img
        alt="Post thumbnail"
        className="aspect-[4/3] overflow-hidden rounded-lg object-cover"
        height="300"
        src={blog.imageUrl || `/placeholder.svg?height=300&width=400`} // Fallback to placeholder if no image
        width="400"
      /> */}
      <h3 className="text-xl font-bold">{blog.title}</h3>
      {mode === "short" ? (
        <p className="text-gray-500">
          {truncateText(blog.excerpt || blog.content, 100)}
        </p>
      ) : (
        <p className="text-gray-500">{blog.content}</p>
      )}
      <Link
        className="text-sm font-medium hover:underline underline-offset-4"
        href={`/blog/${blog.id}`}
      >
        Read More
      </Link>
    </div>
  );
};

export default BlogCard;
