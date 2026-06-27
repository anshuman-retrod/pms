import { fetchApi } from "./core";

export interface PlatformUser {
  id: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  preferred_language: string;
  preferred_timezone: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PlatformUserPayload {
  name: string;
  username: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  preferred_language?: string;
  preferred_timezone?: string;
  is_active?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
  password?: string;
}

export const platformUsersApi = {
  getUsers: () => {
    return fetchApi<PlatformUser[]>("/api/superadmin-users/");
  },
  createUser: (payload: PlatformUserPayload) => {
    return fetchApi<PlatformUser>("/api/superadmin-users/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  updateUser: (id: string, payload: Partial<PlatformUserPayload>) => {
    return fetchApi<PlatformUser>(`/api/superadmin-users/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
  deleteUser: (id: string) => {
    return fetchApi<void>(`/api/superadmin-users/${id}/`, {
      method: "DELETE",
    });
  },
};
