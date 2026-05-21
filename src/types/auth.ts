import { Role } from "./rbac";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  initials: string;
  active: boolean;
  property: string;
  lastActive?: string;
}

export interface AuthSession {
  user: AppUser;
  token: string;
}
