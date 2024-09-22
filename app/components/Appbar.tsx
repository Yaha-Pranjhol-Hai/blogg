"use client"; // we have onClick here, this runs only on the client side; so we need to import it.
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function Appbar() {
    const session = useSession();
    return (
        <div>
            <div className="min-h-screen flex flex-col">
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                        <Link href="/" className="text-2xl font-bold text-gray-900">
                            Blogg
                        </Link>
                        <nav>
    <ul className="flex space-x-4 ">
        <li>
            <Link href="/" className="text-gray-600 hover:text-gray-900">
                Home
            </Link>
        </li>
        {session.data?.user && (
            <li>
                <Link href="/write-blog" className="text-gray-600 hover:text-gray-900">
                    Write a Blog
                </Link>
            </li>
        )}
        <li>
            {session.data?.user ? (
                <button className="bg-blue-400" onClick={() => signOut()}>
                    Logout
                </button>
            ) : (
                <button className="bg-blue-400" onClick={() => signIn()}>
                    SignIn
                </button>
            )}
        </li>
    </ul>
</nav>

                    </div>
                </header>
            </div>
            <footer className="bg-gray-100 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-gray-600">
                    <p>&copy; 2024 Blogg. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
