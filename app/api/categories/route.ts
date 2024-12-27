import { db } from "@/app/db";
import { categories } from "@/app/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const allCategories = await db.select().from(categories);
  return NextResponse.json(allCategories);
}

export async function POST(request: Request) {
  const { name } = await request.json();
  const newCategory = await db.insert(categories).values({ name }).returning();
  return NextResponse.json(newCategory[0]);
}
