import React, { useEffect } from "react";
import { useState } from "react";
import { GET_CATEGORIES } from "@/gql/requests/queries";
import { useQuery } from "@apollo/client";
import { Category, GetCategoriesQuery } from "@/gql/generate/graphql";

interface CategoriesFilterProps {
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function CategoriesFilter({
  selectedCategories,
  setSelectedCategories,
}: CategoriesFilterProps) {
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);
  const [categories, setCategories] = useState<Partial<Category>[]>([]);
  const { data } = useQuery<GetCategoriesQuery>(GET_CATEGORIES);

  useEffect(() => {
    if (data) {
      setCategories(data.categories);
    }
  }, [data]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".categories-dropdown") &&
        !target.closest(".categories-button")
      ) {
        setShowCategoriesMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCheckboxChange = (categoryName: string) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryName)
        ? prevSelected.filter((name) => name !== categoryName)
        : [...prevSelected, categoryName],
    );
  };

  return (
    <div className="relative flex flex-col items-center justify-center md:ml-1">
      <button
        className={`categories-button hover:text-tertiary_color hover:border hover:border-tertiary_color hover:bg-slate-100 hover:bg-primary-800 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center ${showCategoriesMenu ? "text-tertiary_color border border-tertiary_color" : "text-slate-900 border border-slate-300"}`}
        type="button"
        onClick={() => setShowCategoriesMenu(!showCategoriesMenu)}
      >
        Catégorie
        <svg
          className="w-4 h-4 ml-2"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>
      <div
        className={`categories-dropdown ml-20 z-50 absolute shadow-sm shadow-slate-400 bg-slate-100 w-48 p-3 ${showCategoriesMenu ? "" : "hidden"} rounded-lg shadow top-full mt-2 mb-20`}
      >
        <ul className="space-y-2 text-sm" aria-labelledby="dropdownDefault">
          {categories &&
            categories.length > 0 &&
            categories.map((category, index) => (
              <li
                key={index}
                className="flex items-center rounded-lg cursor-pointer"
              >
                <input
                  id={`category-${index}`}
                  type="checkbox"
                  checked={selectedCategories.includes(category.name as string)}
                  className="w-4 h-4 rounded text-primary-600"
                  onChange={() => handleCheckboxChange(category.name!)}
                  onClick={(e) => e.stopPropagation()}
                />
                <label
                  htmlFor={`category-${index}`}
                  className="ml-2 text-sm font-medium text-gray-900 cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  {category.name}
                </label>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
