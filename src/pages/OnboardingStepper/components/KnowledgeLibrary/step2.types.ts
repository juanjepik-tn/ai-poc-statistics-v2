export interface IContentItem {
  id: number;
  title: string;
  content: string;
  category: any;
  updated_at: string;
  tool: boolean;
  canBeDeleted: boolean;
  tool_name: string;
  class: string;
  color?: "primary" | "danger" | "neutral" | "warning" | "success" | undefined;
  iaGenerated: boolean;
  }

export interface ICategoryItem {
  id: number;
  name: string;
}

export interface FrecuentQuestionItem {
  id: number;
  question: string;
  answer: string;
}
