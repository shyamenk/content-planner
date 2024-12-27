"use server";

import { revalidatePath } from "next/cache";
import { db } from "../db";
import { posts } from "../db/schema";
import { eq, isNotNull } from "drizzle-orm";
import { PostResult } from "../type";

export async function getArchivedPosts(): Promise<PostResult> {
  try {
    const result = await db
      .select()
      .from(posts)
      .where(isNotNull(posts.publishedTime));

    const archivedPosts = result.map((post) => ({
      ...post,
      isPosted: true,
    }));

    return { success: archivedPosts };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Database error:", error.message);
      return { error: `Failed to fetch archived posts: ${error.message}` };
    }
    console.error("Unknown error:", error);
    return {
      error: "An unexpected error occurred while fetching archived posts",
    };
  }
}
export async function getPosts(): Promise<PostResult> {
  try {
    const result = await db.select().from(posts);
    const postsWithIsPosted = result.map((post) => ({
      ...post,
      isPosted: post.publishedTime !== null,
    }));
    return { success: postsWithIsPosted };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Database error:", error.message);
      return { error: `Failed to fetch posts: ${error.message}` };
    }
    console.error("Unknown error:", error);
    return { error: "An unexpected error occurred while fetching posts" };
  }
}

export async function createPost(formData: {
  content: string;
  categoryId: number;
  scheduledTime: string;
}): Promise<PostResult> {
  try {
    if (!formData.content || !formData.categoryId || !formData.scheduledTime) {
      return { error: "Missing required fields" };
    }

    const scheduledDate = new Date(formData.scheduledTime);
    if (isNaN(scheduledDate.getTime())) {
      return { error: "Invalid date format" };
    }

    const data = {
      content: formData.content,
      categoryId: formData.categoryId,
      scheduledTime: scheduledDate,
    };

    const result = await db.insert(posts).values(data).returning();
    revalidatePath("/");
    return { success: result.map((post) => ({ ...post, isPosted: false })) };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Post creation error:", error);

      if (error.message.includes("foreign key constraint")) {
        return { error: "Invalid category selected" };
      }

      if (error.message.includes("duplicate key")) {
        return { error: "A similar post already exists" };
      }

      return { error: `Failed to create post: ${error.message}` };
    }

    console.error("Unknown error:", error);
    return { error: "An unexpected error occurred while creating the post" };
  }
}

export async function updatePost(
  id: number,
  formData: {
    content?: string;
    categoryId?: number;
    scheduledTime?: string;
    isPosted?: boolean;
  },
): Promise<PostResult> {
  try {
    const updateData: Partial<typeof posts.$inferInsert> = {};

    if (formData.content) updateData.content = formData.content;
    if (formData.categoryId) updateData.categoryId = formData.categoryId;
    if (formData.scheduledTime) {
      const scheduledDate = new Date(formData.scheduledTime);
      if (isNaN(scheduledDate.getTime())) {
        return { error: "Invalid date format" };
      }
      updateData.scheduledTime = scheduledDate;
    }
    if (formData.isPosted !== undefined) {
      updateData.publishedTime = formData.isPosted ? new Date() : null;
    }

    if (Object.keys(updateData).length === 0) {
      return { error: "No fields to update" };
    }

    await db.update(posts).set(updateData).where(eq(posts.id, id));
    revalidatePath("/posts");
    return { success: [] };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Post update error:", error);

      if (error.message.includes("foreign key constraint")) {
        return { error: "Invalid category selected" };
      }

      return { error: `Failed to update post: ${error.message}` };
    }

    console.error("Unknown error:", error);
    return { error: "An unexpected error occurred while updating the post" };
  }
}

export async function deletePost(id: number): Promise<PostResult> {
  try {
    await db.delete(posts).where(eq(posts.id, id));
    revalidatePath("/posts");
    return { success: [] };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Post deletion error:", error);
      return { error: `Failed to delete post: ${error.message}` };
    }

    console.error("Unknown error:", error);
    return { error: "An unexpected error occurred while deleting the post" };
  }
}
