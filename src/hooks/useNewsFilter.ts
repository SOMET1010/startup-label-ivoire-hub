
import { useState } from "react";
import { type NewsItem } from "@/types/news";

export const useNewsFilter = (allNews: NewsItem[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes");

  const filteredNews = allNews.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         news.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Toutes" || news.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("Toutes");
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    filteredNews,
    resetFilters,
  };
};
