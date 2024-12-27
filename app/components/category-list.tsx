"use client";

import { useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { createCategory, getCategories } from "../actions/category";
import { AddCategoryModal } from "./add-category";
import { CategoryCard } from "./category-card";

interface Category {
  id: number;
  name: string;
}

export function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchCategories() {
    const result = await getCategories();
    if (result.success) {
      setCategories(result.success.categories);
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to fetch categories",
        variant: "destructive",
      });
    }
  }

  async function handleAddCategory(newCategory: string) {
    if (categories.some((cat) => cat.name === newCategory)) {
      toast({
        title: "Error",
        description: "Category already exists",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      const result = await createCategory(newCategory);

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        await fetchCategories();
        toast({
          title: "Success",
          description: "Category added successfully",
        });
      }
    });
  }

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            name={category.name}
            id={category.id}
          />
        ))}
      </div>

      <AddCategoryModal
        onAddCategory={handleAddCategory}
        isPending={isPending}
      />
    </div>
  );
}
