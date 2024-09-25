import BlogCard from "@/app/components/BlogCard";
import { Blog } from "@/types/BlogTypes";

async function fetchBlog(id: string): Promise<Blog | null> {
    const res = await fetch(`/api/blogs/${id}`);
    if(!res.ok) return null;
    return res.json();
}

const BlogPage = async ({ params }: { params: { id: string } }) => {
    const blog = await fetchBlog(params.id);
  
    if (!blog) {
      return <div>Blog not found</div>;
    }
  
    return (
      <div className="p-8">
        <BlogCard blog={blog} mode="full" />
      </div>
    );
  };
  
  export default BlogPage;