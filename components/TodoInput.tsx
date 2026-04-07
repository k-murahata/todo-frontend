"use client";

import { useState } from "react";
import { Priority } from "@/types/todo";

interface TodoInputProps {
  onAdd: (title: string, priority: Priority) => void;
}

export default function TodoInput({ onAdd }: TodoInputProps) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed, priority);
    setText("");
    setPriority("medium");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="新しいTODOを入力..."
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as Priority)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
      >
        <option value="low">低</option>
        <option value="medium">中</option>
        <option value="high">高</option>
      </select>
      <button
        type="submit"
        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors font-medium"
      >
        追加
      </button>
    </form>
  );
}
