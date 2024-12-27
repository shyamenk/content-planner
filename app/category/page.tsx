import React from "react";
import { CategoryList } from "../components/category-list";

const page = () => {
  return (
    <main className="mx-auto px-20 flex-1 p-6 space-y-6">
      <CategoryList />
    </main>
  );
};

export default page;
