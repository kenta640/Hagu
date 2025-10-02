export type UserRole = "USER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  age?: number | null;
  gender?: string | null;
  location?: string | null;
  bio?: string | null;
  profileComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
  images?: Image[];
  interests?: Interest[];
}

export interface Image {
  id: string;
  url: string;
  userId: string;
  createdAt: Date;
}

export interface Interest {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
}

export interface Like {
  id: string;
  senderId: string;
  receiverId: string;
  isMatched: boolean;
  createdAt: Date;
  sender?: User;
  receiver?: User;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  isRead: boolean;
  createdAt: Date;
  sender?: User;
  receiver?: User;
}

export interface Match {
  user: User;
  matchedAt: Date;
}

export interface Conversation {
  userId: string;
  user: User;
  lastMessage: Message;
  unreadCount: number;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalMatches: number;
  totalMessages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
