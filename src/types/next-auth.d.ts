import "next-auth";

type UserRole = "USER" | "ADMIN";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRole;
      profileComplete: boolean;
    };
  }

  interface User {
    role: UserRole;
    profileComplete: boolean;
  }
}
