import { fetchApi } from "./core";

export interface Country {
  code: string;
  name: string;
  phone_code?: string;
  is_active: boolean;
}

export interface Currency {
  code: string;
  name: string;
  symbol?: string;
  is_active: boolean;
}

export interface Timezone {
  code: string;
  name: string;
  utc_offset?: string;
  is_active: boolean;
}

export const referenceApi = {
  getCountries: (isActive?: boolean) => {
    const params = isActive !== undefined ? `?is_active=${isActive}` : "";
    return fetchApi<Country[]>(`/api/reference/countries/${params}`);
  },

  getCurrencies: (isActive?: boolean) => {
    const params = isActive !== undefined ? `?is_active=${isActive}` : "";
    return fetchApi<Currency[]>(`/api/reference/currencies/${params}`);
  },

  getTimezones: (isActive?: boolean) => {
    const params = isActive !== undefined ? `?is_active=${isActive}` : "";
    return fetchApi<Timezone[]>(`/api/reference/timezones/${params}`);
  },
};
