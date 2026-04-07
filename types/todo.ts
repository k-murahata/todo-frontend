export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}

export type Filter = "all" | "active" | "completed";
