"use client";

import React, { createContext, useContext, useState } from "react";
import { FilterOptions, EventFormat, Category } from "@/types";

interface FilterContextType {
  filters: FilterOptions;
  setSearchQuery: (query: string) => void;
  setEventType: (type: EventFormat | "all") => void;
  setCategory: (category: Category | "all") => void;
  setDateFrom: (date: string) => void;
  setDateTo: (date: string) => void;
  setSortBy: (sortBy: "date" | "title") => void;
  setSortOrder: (order: "asc" | "desc") => void;
  resetFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

const DEFAULT_FILTERS: FilterOptions = {
  searchQuery: "",
  eventType: "all",
  category: "all",
  dateFrom: "",
  dateTo: "",
  sortBy: "date",
  sortOrder: "asc",
};

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);

  const setSearchQuery = (query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  };

  const setEventType = (type: EventFormat | "all") => {
    setFilters((prev) => ({ ...prev, eventType: type }));
  };

  const setCategory = (category: Category | "all") => {
    setFilters((prev) => ({ ...prev, category }));
  };

  const setDateFrom = (date: string) => {
    setFilters((prev) => ({ ...prev, dateFrom: date }));
  };

  const setDateTo = (date: string) => {
    setFilters((prev) => ({ ...prev, dateTo: date }));
  };

  const setSortBy = (sortBy: "date" | "title") => {
    setFilters((prev) => ({ ...prev, sortBy }));
  };

  const setSortOrder = (order: "asc" | "desc") => {
    setFilters((prev) => ({ ...prev, sortOrder: order }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        setSearchQuery,
        setEventType,
        setCategory,
        setDateFrom,
        setDateTo,
        setSortBy,
        setSortOrder,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilters must be used within FilterProvider");
  }
  return context;
}
