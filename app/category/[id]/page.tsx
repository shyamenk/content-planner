import SingleTweet from "@/app/components/single-tweet";

type Params = Promise<{ id: number }>;

export default async function CategortTweetPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;

  return (
    <div className="container mt-10  mx-auto px-4 sm:px-6 lg:px-8">
      <SingleTweet id={id} />;
    </div>
  );
}
