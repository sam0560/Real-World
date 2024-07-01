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
  [field: string]: string[];
}

export type NewUser = {
  username: string;
  email: string;
  password: strings;
};

export type User = {
  email: string;
  token: string;
  username: string;
  bio?: string;
  image?: string;
};

export type Comment = {
  id: number;
  createdAt: string;
  updateAt?: string;
  body: string;
  author: Profile;
};
export interface ProtectedRouteProps {
  element: React.ReactNode;
  path: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  user: { username: string; email: string; image?: string } | null;
}

export interface FollowContextType {
  followStates: Map<string, boolean>;
  setFollowState: (username: string, isFollowing: boolean) => void;
}

export interface FollowProviderProps {
  children: ReactNode;
}

// Favorite
export interface FavoritesContextType {
  favoritedArticles: string[];
  addToFavorites: (slug: string) => void;
  removeFromFavorites: (slug: string) => void;
  favoriteArticle: (slug: string) => void;
  unfavoriteArticle: (slug: string) => void;
}

// Favorite Button component
export interface FavoriteButtonProps {
  isFavorited: boolean | null;
  favoritesCount: number;
  onClick: () => void;
}
