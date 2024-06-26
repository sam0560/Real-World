interface author {
  username: string;
  bio: null;
  image: string;
  following: boolean;
}

export type Article = {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: author;
};

export interface Errors {
  errors: Record<string, string[]>;
}

export type User = {
  username: string;
  email: string;
  password: strings;
};

export interface ProtectedRouteProps {
  element: React.ReactNode;
  path: string;
}
