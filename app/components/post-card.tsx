"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Pencil, Trash2, Copy, CheckCircle, Archive } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Post } from "../type";

type PostUpdate = Partial<Omit<Post, "scheduledTime">> & {
  scheduledTime?: Date;
};
interface PostCardProps {
  post: Post;
  onStatusChangeAction: (id: number, isPosted: boolean) => void;
  onDeleteAction: (id: number) => void;
  onEditAction: (id: number, updatedPost: PostUpdate) => void;
}

export function PostCard({
  post,
  onStatusChangeAction,
  onDeleteAction,
  onEditAction,
}: PostCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [editedScheduledTime, setEditedScheduledTime] = useState(
    post.scheduledTime.toISOString().slice(0, 16),
  );
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(post.content);
    toast({
      title: "Copied to clipboard",
      description: "The post content has been copied to your clipboard.",
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onEditAction(post.id, {
      content: editedContent,
      scheduledTime: new Date(editedScheduledTime),
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(post.content);
    setEditedScheduledTime(post.scheduledTime.toISOString().slice(0, 16));
    setIsEditing(false);
  };

  return (
    <TooltipProvider>
      <Card className="w-full  border-neutral-200 hover:bg-muted/50 transition-colors">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src="/avatar.png" alt="User Avatar" />
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span className="font-bold text-sm">Shyam</span>
                <span className="text-muted-foreground text-sm">
                  @shyamenk07
                </span>
                <span className="text-muted-foreground text-sm">·</span>
                <Badge
                  variant={post.isPosted ? "secondary" : "default"}
                  className="text-xs font-normal"
                >
                  {post.isPosted ? "Posted" : "Scheduled"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {format(post.scheduledTime, "h:mm a · MMM d, yyyy")}
              </p>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4 mt-4">
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full min-h-[120px] text-base leading-relaxed resize-none"
                placeholder="What's happening?"
              />
              <Input
                type="datetime-local"
                value={editedScheduledTime}
                onChange={(e) => setEditedScheduledTime(e.target.value)}
                className="w-full"
              />
            </div>
          ) : (
            <p className="mt-3 text-[15px] leading-normal whitespace-pre-wrap">
              {post.content}
            </p>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-3 pt-0 pb-3">
          {isEditing ? (
            <div className="flex justify-end gap-2 w-full">
              <Button size="sm" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between w-full border-t pt-3" />

              <div className="flex flex-wrap gap-2 w-full text-sm">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8"
                  onClick={handleCopy}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8"
                  onClick={handleEdit}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8"
                  onClick={() => onStatusChangeAction(post.id, !post.isPosted)}
                >
                  {post.isPosted ? (
                    <Archive className="h-4 w-4 mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  {post.isPosted ? "Unarchive" : "Archive"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  onClick={() => onDeleteAction(post.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </>
          )}
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}
