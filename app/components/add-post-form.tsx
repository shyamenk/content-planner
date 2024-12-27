"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { createPost } from "@/app/actions/posts";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { DateTimePicker } from "./ui/date-picker";
import { getCategories } from "../actions/category";

type Category = {
  id: number;
  name: string;
};

type FormData = {
  content: string;
  categoryId: number;
  scheduledTime: string;
};

export function AddPostModal() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [scheduledTime, setScheduledTime] = useState<Date | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { pending } = useFormStatus();

  const router = useRouter();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await getCategories();

        if ("error" in result) {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          });
          return;
        }

        if ("success" in result && result.success?.categories) {
          setCategories(result.success.categories);
        }
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive",
        });
        console.error(err);
      }
    };

    loadCategories();
  }, [toast]);

  const validateForm = (): boolean => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Content is required",
        variant: "destructive",
      });
      return false;
    }

    if (!categoryId) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive",
      });
      return false;
    }

    if (!scheduledTime) {
      toast({
        title: "Error",
        description: "Please select a scheduled time",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setContent("");
    setCategoryId("");
    setScheduledTime(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const formData: FormData = {
        content,
        categoryId: parseInt(categoryId),
        scheduledTime: scheduledTime?.toISOString() || "",
      };

      const result = await createPost(formData);

      if ("error" in result) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      resetForm();
      setIsOpen(false);
      router.refresh();
      toast({
        title: "Success",
        description: "Post added successfully!",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-plus"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          Add New Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-6">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-2xl font-semibold">
            Add New Post
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Create a new post and schedule it for publishing
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid gap-2">
            <label htmlFor="content" className="text-sm font-medium">
              Post Content
            </label>
            <Textarea
              id="content"
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              disabled={isLoading}
              className="min-h-[120px] resize-none text-base leading-relaxed"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <Select
              value={categoryId}
              onValueChange={setCategoryId}
              disabled={isLoading}
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="schedule" className="text-sm font-medium">
              Schedule Time
            </label>
            <DateTimePicker
              value={scheduledTime}
              onChange={(date) => setScheduledTime(date)}
              disabled={isLoading}
            />
          </div>
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || pending}
              className="w-full"
            >
              {isLoading || pending ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Adding...
                </div>
              ) : (
                "Add Post"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
