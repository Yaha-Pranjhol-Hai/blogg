export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
}

interface BlogCardProps {
  blog: Blog;
  mode: "short" | "full";
}

export default BlogCardProps;
