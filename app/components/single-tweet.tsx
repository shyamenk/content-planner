"use client";

import { useEffect, useState } from "react";
import { PostGrid } from "./post-grid";
import { usePosts } from "@/hooks/use-posts";
import type { Post } from "@/app/type";

type Props = {
  id: number;
};

const SingleTweet = ({ id }: Props) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const {
    handleFetchByCategory,
    handleStatusChange,
    handleDelete,
    handleEdit,
  } = usePosts();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const fetchedPosts = await handleFetchByCategory(id);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [id, handleFetchByCategory]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <PostGrid
      posts={posts}
      onStatusChange={handleStatusChange}
      onDelete={handleDelete}
      onEdit={handleEdit}
    />
  );
};

export default SingleTweet;
