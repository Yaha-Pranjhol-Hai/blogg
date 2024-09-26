"use client";

import Link from "next/link";
import React from "react";
import BlogCardTypes from "@/types/BlogTypes";
import { Button } from "./ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

const truncateText = (text: string, limit: number) => {
  // if (text.length > limit) {
  //   return text.substring(0, limit) + "...";
  // }
  // return text;
};

const MyBlogCard: React.FC<BlogCardTypes> = ({ blog, mode }) => {
    const router = useRouter();

    const handleEditClick = () => {
        router.push(`/blog/${blog.id}/edit`);
    }

  return (
    <div className="flex flex-col space-y-2 border-2 px-3 py-3">
      <h3 className="text-xl font-bold">{blog.title}</h3>
      {/* {mode === "short" ? (
        <p className="text-gray-500">
          {truncateText(blog.excerpt || blog.content, 100)}
        </p>
      ) : (
        <p className="text-gray-500">{blog.content}</p>
      )} */}
      <Link
        className="text-sm font-medium hover:underline underline-offset-4"
        href={`/blog/${blog.id}`}
      >
        Read More
      </Link>
      <div className="flex justify-end space-x-2">
      <Button variant="outline" onClick={handleEditClick}>
      <Edit className="w-4 h-4 mr-2" />Edit</Button>
      <Button variant="destructive">
      <Trash2 className="w-4 h-4 mr-2" />Delete</Button>
      </div>
    </div>
  );
};

export default MyBlogCard;
