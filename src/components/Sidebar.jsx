import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";

export default function Sidebar({ onCategorySelect }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const categoriesRef = ref(db, "categories");
    const unsubscribe = onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val() || {};
      setCategories(Object.values(data));
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-16 p-4">
      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setSelectedCategory(category.id);
              onCategorySelect(category.id);
            }}
            className={`w-full text-left px-4 py-2 rounded-md ${
              selectedCategory === category.id
                ? "bg-primary text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}