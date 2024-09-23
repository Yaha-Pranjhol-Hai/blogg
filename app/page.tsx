import Link from "next/link";
import { Appbar } from "./components/Appbar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Appbar/>
      <section className="flex-grow flex items-center justify-center py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Welcome to Blogg
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                Exploring ideas, one post at a time. Dive into our world of thoughtful content and engaging stories.
              </p>
            </div>
            <div className="space-x-4">
              <Link
                className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
                href="#"
              >
                Read Latest Post
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
