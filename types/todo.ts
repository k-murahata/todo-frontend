export type Priority = "low" | "medium" | "high";

export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
}

export type Filter = "all" | "active" | "completed";
