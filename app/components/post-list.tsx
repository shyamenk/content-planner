"use client";
import { usePosts } from "@/hooks/use-posts";
import { useEffect } from "react";
import { PostGrid } from "./post-grid";

export function PostList() {
  const { posts, fetchPosts, handleStatusChange, handleDelete, handleEdit } =
    usePosts();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const scheduledPosts = posts.filter((post) => !post.isPosted);

  return (
    <div>
      <PostGrid
        posts={scheduledPosts}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
}
