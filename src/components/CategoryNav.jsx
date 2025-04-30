"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import routes from "@/config/routes";

function CategoryItem({ category, level = 0, activePath, onHover }) {
  const isActive = activePath[level] === category.category_name;
  const showSubCategories = isActive && category.children;

  return (
    <li className="relative">
      <div
        className={cn(
          "flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer rounded-md",
          isActive && "bg-orange-500 text-white hover:bg-orange-600",
          // Add dark mode support for the background color and text color
          "dark:hover:bg-gray-700 dark:bg-gray-800 dark:text-white dark:hover:text-white"
        )}
        onMouseEnter={() =>
          onHover([...activePath.slice(0, level), category.category_name])
        }
      >
        <Link
          to={`${routes.productCategory}/${category.category_id}`}
          className="flex-1"
        >
          {category.category_name}
        </Link>
        {category.children && <ChevronRight className="h-4 w-4" />}
      </div>

      {showSubCategories && (
        <ul
          className={cn(
            "absolute left-full top-0 bg-white dark:bg-gray-800 shadow-lg rounded-md space-y-1 p-2 z-10 min-w-[230px]"
          )}
        >
          {category.children.map((subCategory) => (
            <CategoryItem
              key={subCategory.category_name}
              category={subCategory}
              level={level + 1}
              activePath={activePath}
              onHover={onHover}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function CategoriesNav({ categories }) {
  const [activePath, setActivePath] = useState([]);

  return (
    <nav
      className="relative w-64 bg-white dark:bg-gray-900 shadow-lg"
      onMouseLeave={() => setActivePath([])}
    >
      <ul className="space-y-1 p-2">
        {categories?.map((category) => (
          <CategoryItem
            key={category.category_name}
            category={category}
            level={0}
            activePath={activePath}
            onHover={setActivePath}
          />
        ))}
      </ul>
    </nav>
  );
}
