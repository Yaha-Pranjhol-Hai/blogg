"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import { Appbar } from "../components/Appbar";

export default function WriteBlogPage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null); // Handle the image file
    const [imageUrl, setImageUrl] = useState(''); // Handle the image URL after upload
    const [isImageUploading, setIsImageUploading] = useState(false); // Track if image is uploading
    const [isLoading, setIsLoading] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();

    // Handle image upload on file input change
    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImage(file);
        setIsImageUploading(true); // Start tracking image upload

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/pranjaloncloud/image/upload`, {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (data.secure_url) {
                setImageUrl(data.secure_url); // Store uploaded image URL
            } else {
                alert("Image upload failed");
            }
        } catch (error) {
            console.error("Image upload error:", error);
            alert("Failed to upload image.");
        } finally {
            setIsImageUploading(false); // Image upload complete
        }
    };

    const handleSubmit = async (e: React.MouseEvent) => {
        e.preventDefault();

        if (!title || !content || !imageUrl) {
            alert("All fields are required.");
            return;
        }

        // Prevent form submission if the image is still uploading
        if (isImageUploading) {
            alert("Image is still uploading. Please wait.");
            return;
        }

        if (isLoading) return;
        setIsLoading(true);

        try {
            const response = await fetch("/api/write-blog", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, content, image: imageUrl }), 
            });

            if (response.ok) {
                await response.json();
                router.push('/');
            } else {
                const error = await response.json();
                alert(error.message);
            }

        } catch (error) {
            console.error("POST error:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (status === "loading") return;
        if (status === "unauthenticated") {
            router.push("/auth/signin");
        }
    }, [status, router]);

    return (
        <div className="min-h-screen flex flex-col">
            <Appbar isBlogPage={true} />
            {session && (
                <div className="min-h-screen bg-gray-50">
                    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Post</h1>
                        <form className="bg-white shadow-md rounded-lg p-6 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter your post title"
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">Content</Label>
                                <Textarea
                                    id="content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Write your post content here..."
                                    className="w-full h-64"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">Image</Label>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full"
                                />
                                {isImageUploading && <p>Uploading image, please wait...</p>} {/* Display during image upload */}
                            </div>

                            <div className="flex justify-end space-x-4">
                                <Button type="button" onClick={handleSubmit} disabled={isLoading || isImageUploading}>
                                    {isLoading ? "Publishing..." : "Publish"}
                                </Button>
                            </div>
                        </form>
                    </main>
                </div>
            )}
        </div>
    );
}
