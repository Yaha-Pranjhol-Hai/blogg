"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";

// Dynamic Appbar component with props for dynamic content
export function Appbar({ isBlogPage }: { isBlogPage?: boolean }) {
    const { data: session } = useSession();

    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                {/* Static Logo */}
                <Link href="/" className="text-2xl font-bold text-gray-900">
                    Blogg
                </Link>

                {/* Dynamic Navigation */}
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <Link href="/" className="text-gray-600 hover:text-gray-900">
                                Home
                            </Link>
                        </li>
                        
                        {/* Conditional links based on whether the user is logged in */}
                        {session?.user && (
                            <>
                                {isBlogPage ? (
                                    <li>
                                        <Link href="/write-blog" className="text-gray-600 hover:text-gray-900">
                                            Write a Blog
                                        </Link>
                                    </li>
                                ) : (
                                    <li>
                                        <Link href="/blogs" className="text-gray-600 hover:text-gray-900">
                                            All Blogs
                                        </Link>
                                    </li>
                                )}
                            </>
                        )}
                        <li>
                            {session?.user ? (
                                <Button onClick={() => signOut()}>
                                    Logout
                                </Button>

                            ) : (
                                <Button onClick={() => signIn()}>
                                    SignIn
                                </Button>
                            )}
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}
