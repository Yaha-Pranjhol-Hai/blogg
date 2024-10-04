// BlogTypes.ts
export interface Blog {
  id: number;
  title: string;
  excerpt?: string;
  content: string;
  imageUrl?: string | null;
  upvotes?: number;
}

interface BlogCardProps {
  blog: Blog; // Blog object passed as prop
  mode: "short" | "full"; // Mode for displaying content
  onUpvote?: (blogId: number) => Promise<void>; // Upvote function
}

export default BlogCardProps;
