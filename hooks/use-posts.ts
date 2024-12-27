import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { deletePost, getPosts, updatePost } from "@/app/actions/posts";
import { Post } from "@/app/type";
import { getPostByCatgory } from "@/app/actions/category";

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { toast } = useToast();

  const showSuccessToast = useCallback(
    (message: string) => {
      toast({
        title: "Success",
        description: message,
      });
    },
    [toast],
  );

  const showErrorToast = useCallback(
    (message: string) => {
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
    [toast],
  );

  const fetchPosts = useCallback(async () => {
    try {
      const result = await getPosts();
      if (result.success) {
        setPosts(result.success);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      showErrorToast("Failed to fetch posts. Please try again later.");
    }
  }, [showErrorToast]);

  const handleStatusChange = useCallback(
    async (id: number, isPosted: boolean) => {
      try {
        const result = await updatePost(id, { isPosted });
        if (result.success) {
          setPosts(
            posts.map((post) =>
              post.id === id ? { ...post, isPosted } : post,
            ),
          );
          showSuccessToast(
            `Post ${isPosted ? "archived" : "unarchived"} successfully.`,
          );
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error("Error updating post status:", error);
        showErrorToast("Failed to update post status. Please try again.");
      }
    },
    [posts, showSuccessToast, showErrorToast],
  );

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        const result = await deletePost(id);
        if (result.success !== undefined) {
          setPosts(posts.filter((post) => post.id !== id));
          showSuccessToast("Post deleted successfully.");
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error("Error deleting post:", error);
        showErrorToast("Failed to delete post. Please try again.");
      }
    },
    [posts, showSuccessToast, showErrorToast],
  );

  const handleFetchByCategory = useCallback(
    async (id: number): Promise<Post[]> => {
      try {
        const result = await getPostByCatgory(id);
        if ("success" in result && result.success?.postWithcategory) {
          const fetchedPosts = result.success.postWithcategory;
          setPosts(fetchedPosts);
          showSuccessToast("Posts fetched successfully.");
          return fetchedPosts;
        } else {
          throw new Error(
            "error" in result ? result.error : "Unknown error occurred",
          );
        }
      } catch (error) {
        console.error("Error fetching posts by category:", error);
        showErrorToast("Failed to fetch posts. Please try again.");
        return [];
      }
    },
    [showSuccessToast, showErrorToast],
  );

  const handleEdit = useCallback(
    async (
      id: number,
      updatedPost: Partial<Omit<Post, "scheduledTime">> & {
        scheduledTime?: string;
      },
    ) => {
      try {
        const result = await updatePost(id, updatedPost);
        if (result.success !== undefined) {
          setPosts(
            posts.map((post) =>
              post.id === id
                ? {
                    ...post,
                    ...updatedPost,
                    scheduledTime: updatedPost.scheduledTime
                      ? new Date(updatedPost.scheduledTime)
                      : post.scheduledTime,
                  }
                : post,
            ),
          );
          showSuccessToast("Post updated successfully.");
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error("Error updating post:", error);
        showErrorToast("Failed to update post. Please try again.");
      }
    },
    [posts, showSuccessToast, showErrorToast],
  );

  return {
    posts,
    fetchPosts,
    handleStatusChange,
    handleDelete,
    handleEdit,
    handleFetchByCategory,
  };
};
