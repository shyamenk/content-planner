import { Post } from "../type";
import { PostCard } from "./post-card";

type PostUpdate = Partial<Omit<Post, "scheduledTime">> & {
  scheduledTime?: Date;
};

interface PostGridProps {
  posts: Post[];
  onStatusChange: (id: number, isPosted: boolean) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onEdit: (id: number, updatedPost: PostUpdate) => Promise<void>;
}

export function PostGrid({
  posts,
  onStatusChange,
  onDelete,
  onEdit,
}: PostGridProps) {
  return (
    <div className="masonry-grid sm:columns-2 md:columns-3 gap-4 space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="break-inside-avoid">
          <PostCard
            post={post}
            onStatusChangeAction={onStatusChange}
            onDeleteAction={onDelete}
            onEditAction={onEdit}
          />
        </div>
      ))}
    </div>
  );
}
