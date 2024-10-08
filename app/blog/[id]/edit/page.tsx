"use client";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import { Appbar } from "../../../components/Appbar";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { BlogCardProps } from "@/types/BlogTypes";
import Image from "next/image";

const EditBlog = () => {
    const { id } = useParams(); // Get dynamic route parameter
    const router = useRouter();
    const { data: session } = useSession();
    const [blog, setBlog] = useState<BlogCardProps | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                if (!id) return;

                const res = await fetch(`/api/blog/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setBlog(data);
                    setTitle(data.title || '');
                    setContent(data.content || '');
                    setImageUrl(data.imageUrl || '');
                } else {
                    console.error('Blog not found:', await res.text());
                }
            } catch (error) {
                console.error('Error fetching blog:', error);
            }
        };
        fetchBlog();
    }, [id]);

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
                    body: JSON.stringify({ postId: id, image: reader.result }),
                });

                if (!res.ok) {
                    const error = await res.json();
                    console.error('Failed to update post image:', error);
                    return;
                }

                const data = await res.json();
                setImageUrl(data.imageUrl); // Update the image URL
            } catch (err) {
                console.error('Error uploading image:', err);
            } finally {
                setLoading(false);
            }
        };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Update the Blog Post
        try {
            const res = await fetch(`/api/blog/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content, imageUrl }),
            });

            if (res.ok) {
                router.push(`/my-blogs`);
            }
        } catch (error) {
            console.error("Error updating post", error);
        }
    };

    if (!blog) return <div>Loading...</div>;

    return (
        <div className="min-h-screen flex flex-col">
            <Appbar isBlogPage={true} />
            {/* Hero Section with Create Blog form */}
            {session && (
                <div className="min-h-screen bg-gray-50">
                    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <form className="bg-white shadow-md rounded-lg p-6 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">Content</Label>
                                <Textarea
                                    id="content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full h-64"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">Upload Image</Label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                                {/* Show the current image if exists */}
                                {imageUrl && (
                                    <div className="relative w-full h-64">
                                        <Image
                                            src={imageUrl}
                                            alt={title}
                                            layout="fill"
                                            objectFit="cover"
                                            className="rounded-lg"
                                        />
                                    </div>
                                )}
                                {loading && <p>Uploading image...</p>}
                            </div>

                            <div className="flex justify-end space-x-4">
                                <Button type="submit" onClick={handleSubmit}>
                                    Update Blog
                                </Button>
                            </div>
                        </form>
                    </main>
                </div>
            )}
        </div>
    );
};

export default EditBlog;
