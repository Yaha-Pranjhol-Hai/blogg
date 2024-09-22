// import Link from 'next/link'
// import { ArrowRight } from 'lucide-react'

// const blogPosts = [
//   { id: 1, title: "Getting Started with Next.js", excerpt: "Learn the basics of Next.js and start building awesome React applications.", date: "2023-05-15" },
//   { id: 2, title: "The Power of Tailwind CSS", excerpt: "Discover how Tailwind CSS can streamline your styling workflow and boost productivity.", date: "2023-05-20" },
//   { id: 3, title: "Mastering React Hooks", excerpt: "Dive deep into React Hooks and learn how to write more efficient and cleaner React code.", date: "2023-05-25" },
//   { id: 4, title: "Building Responsive Layouts", excerpt: "Explore techniques for creating responsive layouts that work across all devices.", date: "2023-05-30" },
// ]

// export default function Home() {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <header className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
//           <Link href="/" className="text-2xl font-bold text-gray-900">
//             MiniBlog
//           </Link>
//           <nav>
//             <ul className="flex space-x-4">
//               <li><Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link></li>
//               <li><Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link></li>
//               <li><Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link></li>
//             </ul>
//           </nav>
//         </div>
//       </header>

//       <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <h1 className="text-4xl font-bold text-gray-900 mb-8">Latest Posts</h1>
//         <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
//           {blogPosts.map((post) => (
//             <article key={post.id} className="bg-white shadow-md rounded-lg overflow-hidden">
//               <div className="p-6">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h2>
//                 <p className="text-gray-600 mb-4">{post.excerpt}</p>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-500">{post.date}</span>
//                   <Link href={`/post/${post.id}`} className="text-blue-600 hover:text-blue-800 flex items-center">
//                     Read more <ArrowRight className="ml-1 w-4 h-4" />
//                   </Link>
//                 </div>
//               </div>
//             </article>
//           ))}
//         </div>
//       </main>

//       <footer className="bg-gray-100 mt-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-gray-600">
//           <p>&copy; 2023 MiniBlog. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   )
// }