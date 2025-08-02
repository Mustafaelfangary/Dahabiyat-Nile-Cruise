import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "MANAGER" | "GUIDE" | "USER";
      originalRole: "ADMIN" | "MANAGER" | "GUIDE" | "USER";
    } & DefaultSession["user"];
  }

  interface User {
    role: "ADMIN" | "MANAGER" | "GUIDE" | "USER";
    originalRole?: "ADMIN" | "MANAGER" | "GUIDE" | "USER";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "ADMIN" | "MANAGER" | "GUIDE" | "USER";
    originalRole: "ADMIN" | "MANAGER" | "GUIDE" | "USER";
  }
}
