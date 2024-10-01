"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useState } from "react";
import { usePathname } from "next/navigation";

export function Appbar({}: { isBlogPage?: boolean }) {
    const { data: session } = useSession();
    const pathname = usePathname(); // Get the current path

    // State for mobile menu toggle
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                {/* Static Logo */}
                <Link href="/" className="text-2xl font-bold text-gray-900">
                    Blogg
                </Link>

                {/* Hamburger Menu for Mobile */}
                <button
                    className="sm:hidden block text-gray-800 hover:text-gray-600 focus:outline-none"
                    onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                        />
                    </svg>
                </button>

                {/* Navigation for larger screens */}
                <nav className="hidden sm:flex items-center space-x-6">
                    <Link href="/" className={`text-gray-600 hover:text-gray-900 ${pathname === "/" ? "font-bold text-gray-800" : ""}`}>
                        Home
                    </Link>
                    {session?.user ? (
                        <>
                            <Link href="/write-blog" className={`text-gray-600 hover:text-gray-900 ${pathname === "/write-blog" ? "font-bold text-gray-800" : ""}`}>
                                Write a Blog
                            </Link>
                            <Link href="/my-blogs" className={`text-gray-600 hover:text-gray-900 ${pathname === "/my-blogs" ? "font-bold text-gray-800" : ""}`}>
                                My Blogs
                            </Link>
                            <Link href="/blogs" className={`text-gray-600 hover:text-gray-900 ${pathname === "/blogs" ? "font-bold text-gray-800" : ""}`}>
                                All Blogs
                            </Link>
                            <Link href="/contact" className={`text-gray-600 hover:text-gray-900 ${pathname === "/contact" ? "font-bold text-gray-800" : ""}`}>
                                Contact
                            </Link>
                            <Button onClick={() => signOut()}>Logout</Button>
                        </>
                    ) : (
                        <>
                            <Link href="/blogs" className={`text-gray-600 hover:text-gray-900 ${pathname === "/blogs" ? "font-bold text-gray-800" : ""}`}>
                                All Blogs
                            </Link>
                            <Link href="/contact" className={`text-gray-600 hover:text-gray-900 ${pathname === "/contact" ? "font-bold text-gray-800" : ""}`}>
                                Contact
                            </Link>
                            <Button onClick={() => signIn()}>SignIn</Button>
                        </>
                    )}
                </nav>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="sm:hidden bg-white shadow-md py-4 border-t border-gray-200">
                    <div className="flex flex-col items-center space-y-4">
                        <Link href="/" className={`text-gray-600 hover:text-gray-900 ${pathname === "/" ? "font-bold text-gray-800" : ""}`}>
                            Home
                        </Link>
                        {session?.user ? (
                            <>
                                <Link href="/write-blog" className={`text-gray-600 hover:text-gray-900 ${pathname === "/write-blog" ? "font-bold text-gray-800" : ""}`}>
                                    Write a Blog
                                </Link>
                                <Link href="/my-blogs" className={`text-gray-600 hover:text-gray-900 ${pathname === "/my-blogs" ? "font-bold text-gray-800" : ""}`}>
                                    My Blogs
                                </Link>
                                <Link href="/blogs" className={`text-gray-600 hover:text-gray-900 ${pathname === "/blogs" ? "font-bold text-gray-800" : ""}`}>
                                    All Blogs
                                </Link>
                                <Link href="/contact" className={`text-gray-600 hover:text-gray-900 ${pathname === "/contact" ? "font-bold text-gray-800" : ""}`}>
                                    Contact
                                </Link>
                                <Button onClick={() => signOut()}>Logout</Button>
                            </>
                        ) : (
                            <>
                                <Link href="/blogs" className={`text-gray-600 hover:text-gray-900 ${pathname === "/blogs" ? "font-bold text-gray-800" : ""}`}>
                                    All Blogs
                                </Link>
                                <Link href="/contact" className={`text-gray-600 hover:text-gray-900 ${pathname === "/contact" ? "font-bold text-gray-800" : ""}`}>
                                    Contact
                                </Link>
                                <Button onClick={() => signIn()}>SignIn</Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
