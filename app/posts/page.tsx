import { AddPostModal } from "../components/add-post-form";
import { PostList } from "../components/post-list";

export const dynamic = "force-dynamic";

export default function AddPostPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-end mt-4 p-6">
        <AddPostModal />
      </div>
      <PostList />
    </div>
  );
}
