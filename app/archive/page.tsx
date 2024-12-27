import { ArchivedPostList } from "../components/archived-posts";

export default function ArchivePage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <main className="flex-1 p-6 space-y-6">
        <ArchivedPostList />
      </main>
    </div>
  );
}
