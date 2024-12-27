import { NextResponse } from "next/server";
import { and, eq, lte, isNull } from "drizzle-orm";
import { db } from "@/app/db";
import { posts } from "@/app/db/schema";

export async function GET() {
  const now = new Date();
  const scheduledPosts = await db
    .select()
    .from(posts)
    .where(and(lte(posts.scheduledTime, now), isNull(posts.publishedTime)));

  for (const post of scheduledPosts) {
    await db
      .update(posts)
      .set({ publishedTime: now })
      .where(eq(posts.id, post.id));
  }

  return NextResponse.json({
    message: `Published ${scheduledPosts.length} posts`,
  });
}
