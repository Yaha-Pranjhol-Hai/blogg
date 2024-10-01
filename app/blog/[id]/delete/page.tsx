"use client"

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const DeleteBlog = () => {
    const { id } = useParams();
    const router = useRouter();

    useEffect(() => {
        if(!id) return;

        const deleteBlog = async () => {
    
            try {
                const res = await fetch(`/api/blog/${id}`, {
                    method: 'DELETE'
                }
                )
    
                if(res.ok){
                    router.push(`/my-blogs`);
                }
            } catch (error) {
                console.error(error);
            }
        }

        deleteBlog();
    }, [id, router]) 
}

export default DeleteBlog;