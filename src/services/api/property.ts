import { fetchApi } from "./core";

export interface Property {
  id: string;
  name: string;
  property_type: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  contact_email: string;
  contact_phone: string;
  currency: string;
  timezone: string;
  is_active: boolean;
}

export interface SuperadminProperty {
  id?: string;
  tenant: string;
  tenant_name?: string;
  name: string;
  property_type: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  contact_email: string;
  contact_phone: string;
  currency: string;
  timezone: string;
  image_url?: string;
  is_active: boolean;
}


export const propertyApi = {
  getProperties: () => {
    return fetchApi<Property[]>("/api/properties/");
  },
  createProperty: (payload: Omit<Property, "id" | "is_active">) => {
    return fetchApi<Property>("/api/properties/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  // --- Superadmin Endpoints ---
  getSuperadminProperties: () => {
    return fetchApi<SuperadminProperty[]>("/api/superadmin-properties/");
  },
  createSuperadminProperty: (payload: Omit<SuperadminProperty, "id">) => {
    return fetchApi<SuperadminProperty>("/api/superadmin-properties/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  updateSuperadminProperty: (id: string, payload: Partial<SuperadminProperty>) => {
    return fetchApi<SuperadminProperty>(`/api/superadmin-properties/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
  deleteSuperadminProperty: (id: string) => {
    return fetchApi<void>(`/api/superadmin-properties/${id}/`, {
      method: "DELETE",
    });
  },
  uploadPropertyImage: (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return fetchApi<{ image_url: string }>("/api/superadmin-properties/upload-image/", {
      method: "POST",
      body: formData,
    });
  },
};
