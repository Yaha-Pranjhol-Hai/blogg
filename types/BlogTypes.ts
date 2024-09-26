export interface Blog {
  id: number;
  title: string;
  excerpt?: string;
  content: string;
  imageUrl?: string | null;
}

interface BlogCardProps {
  blog: Blog;
  mode: "short" | "full";
}

export default BlogCardProps;
