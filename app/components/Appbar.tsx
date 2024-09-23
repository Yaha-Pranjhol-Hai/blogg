"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

export function Appbar({ isBlogPage }: { isBlogPage?: boolean }) {
    const { data: session } = useSession();
    const pathname = usePathname(); // Get the current path

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                {/* Static Logo */}
                <Link href="/" className="text-2xl font-bold text-gray-900">
                    Blogg
                </Link>

                {/* Navigation aligned to the right */}
                <nav className="flex items-center space-x-6">
                    <Link href="/" className={`text-gray-600 hover:text-gray-900 ${pathname === "/" ? "font-bold text-gray-800" : ""}`}>
                        Home
                    </Link>
                    <Link href="/contact" className={`text-gray-600 hover:text-gray-900 ${pathname === "/contact" ? "font-bold text-gray-800" : ""}`}>
                        Contact
                    </Link>

                    {/* Conditional Blog Link based on user authentication */}
                    {session?.user ? (
                        <div className="flex space-x-6 items-center">
                            <Link href="/write-blog" className={`text-gray-600 hover:text-gray-900 ${pathname === "/write-blog" ? "font-bold text-gray-800" : ""}`}>
                                Write a Blog
                            </Link>
                            <Link href="/blogs" className={`text-gray-600 hover:text-gray-900 ${pathname === "/blogs" ? "font-bold text-gray-800" : ""}`}>
                                All Blogs
                            </Link>
                            <Button onClick={() => signOut()}>Logout</Button>
                        </div>
                    ) : (
                        <div className="flex space-x-6 items-center">
                            <Link href="/blogs" className={`text-gray-600 hover:text-gray-900 ${pathname === "/blogs" ? "font-bold text-gray-800" : ""}`}>
                                All Blogs
                            </Link>
                            <Button onClick={() => signIn()}>SignIn</Button>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}
