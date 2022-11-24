export interface ICategory {
  id: number;
  title: string;
}
export interface IPost {
  id: number;
  title: string;
  content: string;
  status: "published" | "draft" | "rejected";
  createdAt: string;
  category: { id: number };
}

export interface IMember {
  Id: number;
  Name: string;
  Avatar: string;
  CreatedAt: string;
  UpdatedAt: string;
}
