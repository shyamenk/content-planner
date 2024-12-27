import { categories } from "./db/schema";

export interface Post {
  id: number;
  content: string;
  categoryId: number;
  scheduledTime: Date;
  publishedTime: Date | null;
  createdAt: Date;
  updatedAt: Date;
  isPosted: boolean;
}

export type CategoryResult = {
  success?: { categories: (typeof categories.$inferSelect)[] };
  error?: string;
};

export type PostResult = {
  success?: Post[];
  error?: string;
};
