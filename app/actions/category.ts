"use server";

import { revalidatePath } from "next/cache";
import { db } from "../db";
import { categories, posts } from "../db/schema";
import { CategoryResult, PostResult } from "../type";
import { eq } from "drizzle-orm";

export async function getCategories(): Promise<CategoryResult> {
  try {
    const result = await db.select().from(categories);
    return { success: { categories: result } };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Database error:", error.message);
      return { error: `Failed to fetch categories: ${error.message}` };
    }
    console.error("Unknown error:", error);
    return { error: "An unexpected error occurred while fetching categories" };
  }
}

export async function getPostByCatgory(id: number) {
  try {
    const result = await db
      .select()
      .from(posts)
      .where(eq(posts.categoryId, id));

    const postsWithCategory = result.map((post) => ({
      ...post,
      isPosted: post.publishedTime !== null,
    }));

    return { success: { postWithcategory: postsWithCategory } };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Database error:", error.message);
      return { error: `Failed to fetch categories: ${error.message}` };
    }
    console.error("Unknown error:", error);
    return {
      error: "An unexpected error occurred while fetching categories",
    };
  }
}

export async function createCategory(name: string): Promise<PostResult> {
  try {
    if (!name) {
      return { error: "Category name is required" };
    }

    await db.insert(categories).values({ name });
    revalidatePath("/posts");
    return { success: [] };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Category creation error:", error);

      if (error.message.includes("duplicate key")) {
        return { error: "A category with this name already exists" };
      }

      return { error: `Failed to create category: ${error.message}` };
    }

    console.error("Unknown error:", error);
    return {
      error: "An unexpected error occurred while creating the category",
    };
  }
}
