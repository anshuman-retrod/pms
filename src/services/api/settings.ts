import { getSubdomain, authApi } from "../auth-api";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface SystemLanguageData {
  id?: string;
  name: string;
  code: string;
  is_active: boolean;
  is_default: boolean;
}

export interface SystemTaxData {
  id?: string;
  name: string;
  rate: number;
  type: "percentage" | "fixed";
  status: "active" | "inactive";
  tenant?: string | null;
}

export interface SystemDocumentTypeData {
  id?: string;
  name: string;
  required_checkin: boolean;
  expiry_required: boolean;
  tenant?: string | null;
}

export interface SystemFacilityData {
  id?: string;
  name: string;
  chargeable: boolean;
  price: number;
  description: string;
  icon_name: string;
  tenant?: string | null;
}

export interface SystemCurrencyData {
  id?: string;
  code: string;
  symbol: string;
  name: string;
  is_active: boolean;
  is_default: boolean;
  tenant?: string | null;

  // Format Settings
  symbol_position?: string;
  decimal_places?: number;
  decimal_separator?: string;
  thousands_separator?: string;
  add_space?: boolean;
  show_decimals?: boolean;
}

export interface SystemDateFormatData {
  id?: string;
  format: string;
  label: string;
  is_default: boolean;
  tenant?: string | null;
}

export interface SystemTimeFormatData {
  id?: string;
  format: string;
  label: string;
  is_default: boolean;
  tenant?: string | null;
}

class SettingsApiClient {
  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Tenant-Subdomain": getSubdomain(),
    };
    const token = localStorage.getItem("retrod.auth.access_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  private async handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      let errMsg = "An error occurred";
      try {
        const errorData = await res.json();
        errMsg = errorData.error || errorData.detail || JSON.stringify(errorData);
      } catch {
        errMsg = await res.text();
      }
      throw new Error(errMsg);
    }
    return res.json() as Promise<T>;
  }



  // Languages
  async getLanguages(): Promise<SystemLanguageData[]> {
    const res = await fetch(`${BASE_URL}/api/superadmin-languages/`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    return this.handleResponse(res);
  }

  async createLanguage(data: SystemLanguageData): Promise<SystemLanguageData> {
    const res = await fetch(`${BASE_URL}/api/superadmin-languages/`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(res);
  }

  async updateLanguage(id: string, data: Partial<SystemLanguageData>): Promise<SystemLanguageData> {
    const res = await fetch(`${BASE_URL}/api/superadmin-languages/${id}/`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(res);
  }

  async deleteLanguage(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/superadmin-languages/${id}/`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    if (!res.ok) {
      throw new Error("Failed to delete language.");
    }
  }

  // Taxes
  async getTaxes(): Promise<SystemTaxData[]> {
    const res = await fetch(`${BASE_URL}/api/superadmin-taxes/`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    return this.handleResponse(res);
  }

  async createTax(data: SystemTaxData): Promise<SystemTaxData> {
    const res = await fetch(`${BASE_URL}/api/superadmin-taxes/`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(res);
  }

  async updateTax(id: string, data: Partial<SystemTaxData>): Promise<SystemTaxData> {
    const res = await fetch(`${BASE_URL}/api/superadmin-taxes/${id}/`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(res);
  }

  async deleteTax(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/superadmin-taxes/${id}/`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    if (!res.ok) {
      throw new Error("Failed to delete tax.");
    }
  }

  // Documents
  async getDocuments(): Promise<SystemDocumentTypeData[]> {
    const res = await fetch(`${BASE_URL}/api/superadmin-documents/`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    return this.handleResponse(res);
  }

  async createDocument(data: SystemDocumentTypeData): Promise<SystemDocumentTypeData> {
    const res = await fetch(`${BASE_URL}/api/superadmin-documents/`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(res);
  }

  async updateDocument(id: string, data: Partial<SystemDocumentTypeData>): Promise<SystemDocumentTypeData> {
    const res = await fetch(`${BASE_URL}/api/superadmin-documents/${id}/`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(res);
  }

  async deleteDocument(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/superadmin-documents/${id}/`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    if (!res.ok) {
      throw new Error("Failed to delete document type.");
    }
  }

  // Facilities
  async getFacilities(): Promise<SystemFacilityData[]> {
    const res = await fetch(`${BASE_URL}/api/superadmin-facilities/`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    return this.handleResponse(res);
  }

  async createFacility(data: SystemFacilityData): Promise<SystemFacilityData> {
    const res = await fetch(`${BASE_URL}/api/superadmin-facilities/`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(res);
  }

  async updateFacility(id: string, data: Partial<SystemFacilityData>): Promise<SystemFacilityData> {
    const res = await fetch(`${BASE_URL}/api/superadmin-facilities/${id}/`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(res);
  }

  async deleteFacility(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/superadmin-facilities/${id}/`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    if (!res.ok) {
      throw new Error("Failed to delete facility.");
    }
  }

  // Currencies
  async getCurrencies(): Promise<SystemCurrencyData[]> {
    const res = await fetch(`${BASE_URL}/api/superadmin-currencies/`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    return this.handleResponse(res);
  }

  async createCurrency(data: SystemCurrencyData): Promise<SystemCurrencyData> {
    const res = await fetch(`${BASE_URL}/api/superadmin-currencies/`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(res);
  }

  async updateCurrency(id: string, data: Partial<SystemCurrencyData>): Promise<SystemCurrencyData> {
    const res = await fetch(`${BASE_URL}/api/superadmin-currencies/${id}/`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(res);
  }

  async deleteCurrency(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/superadmin-currencies/${id}/`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    if (!res.ok) {
      throw new Error("Failed to delete currency.");
    }
  }

  // Date Formats
  async getDateFormats(): Promise<SystemDateFormatData[]> {
    const res = await fetch(`${BASE_URL}/api/superadmin-date-formats/`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    return this.handleResponse(res);
  }

  async createDateFormat(data: SystemDateFormatData): Promise<SystemDateFormatData> {
    const res = await fetch(`${BASE_URL}/api/superadmin-date-formats/`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(res);
  }

  async updateDateFormat(id: string, data: Partial<SystemDateFormatData>): Promise<SystemDateFormatData> {
    const res = await fetch(`${BASE_URL}/api/superadmin-date-formats/${id}/`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(res);
  }

  async deleteDateFormat(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/superadmin-date-formats/${id}/`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    if (!res.ok) {
      throw new Error("Failed to delete date format.");
    }
  }

  // Time Formats
  async getTimeFormats(): Promise<SystemTimeFormatData[]> {
    const res = await fetch(`${BASE_URL}/api/superadmin-time-formats/`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    return this.handleResponse(res);
  }

  async createTimeFormat(data: SystemTimeFormatData): Promise<SystemTimeFormatData> {
    const res = await fetch(`${BASE_URL}/api/superadmin-time-formats/`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(res);
  }

  async updateTimeFormat(id: string, data: Partial<SystemTimeFormatData>): Promise<SystemTimeFormatData> {
    const res = await fetch(`${BASE_URL}/api/superadmin-time-formats/${id}/`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(res);
  }

  async deleteTimeFormat(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/superadmin-time-formats/${id}/`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    if (!res.ok) {
      throw new Error("Failed to delete time format.");
    }
  }
}

export const settingsApi = new SettingsApiClient();
