"use client";

import Link from "next/link";
import React, { useState } from "react";
import BlogCardTypes from "@/types/BlogTypes";
import { Button } from "./ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const MyBlogCard: React.FC<BlogCardTypes> = ({ blog }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(blog.imageUrl || "");

    const handleEditClick = () => {
        router.push(`/blog/${blog.id}/edit`);
    };

    const handleDeleteClick = () => {
        router.push(`/blog/${blog.id}/delete`);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/updatePostImage", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ postId: blog.id, image: reader.result }),
                });

                if (!res.ok) {
                    const error = await res.json();
                    console.error('Failed to update post image:', error);
                    return;
                }

                const data = await res.json();
                setImage(data.imageUrl); // Update the image URL
            } catch (err) {
                console.error('Error uploading image:', err);
            } finally {
                setLoading(false);
            }
        };
    };

    return (
        <div className="flex flex-col space-y-2 border-2 px-3 py-3">
            <h3 className="text-xl font-bold">{blog.title}</h3>
            {image && <Image width={600} height={400} quality={100} src={image} alt={blog.title} className="w-full h-auto my-4 object-cover" />}
            
            {/* Show image upload only if there is no image */}
            {!image && <input type="file" onChange={handleImageUpload} />}
            {loading && <p>Uploading image...</p>}
            
            <Link className="text-sm font-medium hover:underline underline-offset-4" href={`/blog/${blog.id}`}>
                Read More
            </Link>
            <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleEditClick}>
                    <Edit className="w-4 h-4 mr-2" /> Edit
                </Button>
                <Button variant="destructive" onClick={handleDeleteClick}>
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                </Button>
            </div>
        </div>
    );
};

export default MyBlogCard;
