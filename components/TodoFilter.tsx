"use client";

import { Filter } from "@/types/todo";

interface TodoFilterProps {
  current: Filter;
  onChange: (filter: Filter) => void;
  counts: { all: number; active: number; completed: number };
}

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "すべて" },
  { value: "active", label: "未完了" },
  { value: "completed", label: "完了済み" },
];

export default function TodoFilter({ current, onChange, counts }: TodoFilterProps) {
  return (
    <div className="flex gap-1 mb-4">
      {filters.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            current === value
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          {label}
          <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
            current === value ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500"
          }`}>
            {counts[value]}
          </span>
        </button>
      ))}
    </div>
  );
}
