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
    const { data: session, status } = useSession();
    const router = useRouter();

    const handleSubmit = (e: React.MouseEvent) => {
        e.preventDefault();
        router.push('/');
    };

    useEffect(() => {
        if (status === "loading") return; // Wait for the session status to resolve
        if (status === "unauthenticated") {
            router.push("/auth/signin");
        }
    }, [status, router]);
    

    return (
        <div className="min-h-screen flex flex-col">
            <Appbar isBlogPage={true} />
            {/* Hero Section with Create Blog form */}
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

                            <div className="flex justify-end space-x-4">
                                <Button type="button" onClick={handleSubmit}>
                                    Publish
                                </Button>
                            </div>
                        </form>
                    </main>
                </div>
            )}
        </div>
    );
}
