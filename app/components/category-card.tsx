import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface CategoryCardProps {
  name: string;
  id: number;
}

export function CategoryCard({ name, id }: CategoryCardProps) {
  const emoji = "🌟";

  return (
    <Link href={`/category/${id}`} className="block">
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl" role="img" aria-label={name}>
              {emoji}
            </span>
            <h3 className="text-lg font-semibold text-gray-800 capitalize">
              {name}
            </h3>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
