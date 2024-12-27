"use server";

import { db } from "../db";
import { posts } from "../db/schema";
import { isNull, desc, isNotNull, sql } from "drizzle-orm";

export type DashboardCounts = {
  scheduledCount: number;
  archivedCount: number;
};

export type ActivityItem = {
  id: number;
  type: "scheduled" | "archived";
  content: string;
  timestamp: Date;
};

export async function getDashboardCounts(): Promise<DashboardCounts> {
  try {
    const [scheduledCount, archivedCount] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)` })
        .from(posts)
        .where(isNull(posts.publishedTime)),
      db
        .select({ count: sql<number>`count(*)` })
        .from(posts)
        .where(isNotNull(posts.publishedTime)),
    ]);

    return {
      scheduledCount: scheduledCount[0].count,
      archivedCount: archivedCount[0].count,
    };
  } catch (error) {
    console.error("Error fetching dashboard counts:", error);
    return { scheduledCount: 0, archivedCount: 0 };
  }
}

export async function getRecentActivity(): Promise<ActivityItem[]> {
  try {
    const recentActivity = await db
      .select({
        id: posts.id,
        content: posts.content,
        createdAt: posts.createdAt,
        publishedTime: posts.publishedTime,
        scheduledTime: posts.scheduledTime,
      })
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .limit(10);

    return recentActivity.map((post) => ({
      id: post.id,
      type: post.publishedTime ? "archived" : "scheduled",
      content: post.content,
      timestamp: post.publishedTime || post.scheduledTime,
    }));
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return [];
  }
}
