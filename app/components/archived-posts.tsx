"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { updatePost, deletePost, getArchivedPosts } from "../actions/posts";
import { PostCard } from "./post-card";
import { Post } from "../type";

type UpdatePostInput = {
  content?: string;
  categoryId?: number;
  scheduledTime?: string;
  isPosted?: boolean;
};

export function ArchivedPostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { toast } = useToast();

  const fetchArchivedPosts = useCallback(async () => {
    try {
      const result = await getArchivedPosts();
      if (result.success) {
        setPosts(result.success);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error fetching archived posts:", error);
      toast({
        title: "Error",
        description: "Failed to fetch archived posts. Please try again later.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchArchivedPosts();
  }, [fetchArchivedPosts]);

  const handleDelete = async (id: number) => {
    try {
      const result = await deletePost(id);
      if (result.success !== undefined) {
        setPosts(posts.filter((post) => post.id !== id));
        toast({
          title: "Success",
          description: "Post deleted successfully.",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (id: number, updatedPost: Partial<Post>) => {
    try {
      // Convert Date to string for the API
      const updateData: UpdatePostInput = {
        content: updatedPost.content,
        categoryId: updatedPost.categoryId,
        scheduledTime: updatedPost.scheduledTime?.toISOString(),
        isPosted: updatedPost.isPosted,
      };

      const result = await updatePost(id, updateData);
      if (result.success !== undefined) {
        setPosts(
          posts.map((post) =>
            post.id === id ? { ...post, ...updatedPost } : post,
          ),
        );
        toast({
          title: "Success",
          description: "Post updated successfully.",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error updating post:", error);
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (id: number, isPosted: boolean) => {
    try {
      const result = await updatePost(id, { isPosted });
      if (result.success !== undefined) {
        setPosts(
          posts.map((post) => (post.id === id ? { ...post, isPosted } : post)),
        );
        toast({
          title: "Success",
          description: `Post ${isPosted ? "archived" : "unarchived"} successfully.`,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error updating post status:", error);
      toast({
        title: "Error",
        description: "Failed to update post status. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Archived Posts</h2>
      <div className="masonry-grid sm:columns-2 md:columns-3 gap-4 space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="break-inside-avoid">
            <PostCard
              post={post}
              onDeleteAction={handleDelete}
              onEditAction={handleEdit}
              onStatusChangeAction={handleStatusChange}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
