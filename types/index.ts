export type EventFormat = "Online" | "In-Person";
export type Category =
  | "business"
  | "education"
  | "entertainment"
  | "sports"
  | "technology"
  | "health"
  | "other";

export interface Event {
  id: string;
  title: string;
  description: string;
  eventType: EventFormat;
  location?: string;
  eventLink?: string;
  startDateTime: string;
  endDateTime: string;
  category: Category;
  organizerId: string;
  organizerName: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  userId: string | null;
}

export interface FilterOptions {
  searchQuery: string;
  eventType: EventFormat | "all";
  category: Category | "all";
  dateFrom: string;
  dateTo: string;
  sortBy: "date" | "title";
  sortOrder: "asc" | "desc";
}
