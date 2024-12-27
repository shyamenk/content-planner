import { db } from "@/app/db";
import { posts } from "@/app/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const allPosts = await db.select().from(posts);
    return NextResponse.json(allPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { content, categoryId, scheduledTime } = await request.json();
    const newPost = await db
      .insert(posts)
      .values({ content, categoryId, scheduledTime })
      .returning();
    return NextResponse.json(newPost[0]);
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
