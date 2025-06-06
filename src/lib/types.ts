export type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  content: string;
  summary?: string;
  imageUrl?: string;
  createdAt: string; // ISO string date
  updatedAt: string; // ISO string date
};

export type BlogPostFormData = {
  title: string;
  content: string;
  imageUrl?: string;
};
