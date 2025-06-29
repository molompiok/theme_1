import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "../store/user";

// export const BASE_URL = import.meta.env.VITE_BASE_URL;
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// export const BASE_URL = {
//   apiUrl: "",
//   serverApiUrl: "",
// };

// export const api = {
//   api: null as AxiosInstance | null,
//   server: null as AxiosInstance | null,
// };

interface FilterValue {
  text: string;
  key: string | null;
  icon: string[] | Record<string, never>;
}

export function build_search_params(params: {
  [key: string]:
  | string
  | number
  | string[]
  | Record<string, FilterValue[]>
  | undefined;
}): URLSearchParams {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) return;

    if (
      key === "filters" &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      // Gestion des filtres comme Record<string, FilterValue[]>
      Object.entries(value as Record<string, FilterValue[]>).forEach(
        ([filterKey, filterValues]) => {
          filterValues.forEach((filterValue, index) => {
            // Ajouter text comme valeur principale
            searchParams.append(
              `filters[${filterKey}][${index}][text]`,
              filterValue.text
            );
            // Ajouter key s'il existe, ou "null" explicite
            searchParams.append(
              `filters[${filterKey}][${index}][key]`,
              filterValue.key !== null ? filterValue.key : "null"
            );
            // Optionnel : inclure icon si nécessaire (par exemple, la première URL)
            if (
              Array.isArray(filterValue.icon) &&
              filterValue.icon.length > 0
            ) {
              searchParams.append(
                `filters[${filterKey}][${index}][icon]`,
                filterValue.icon[0]
              );
            }
          });
        }
      );
    } else if (Array.isArray(value)) {
      value.forEach((item) => {
        searchParams.append(key, item.toString());
      });
    } else {
      searchParams.set(key, value.toString());
    }
  });

  return searchParams;
}

export function build_form_data(
  params: Record<
    string,
    string | number | boolean | undefined | Record<string, string>
  >
): FormData {
  const formData = new FormData();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) return;

    if (key === "bind" && typeof value === "object" && !Array.isArray(value)) {
      // Gérer bind comme un objet imbriqué
      Object.entries(value as Record<string, string>).forEach(
        ([bindKey, bindValue]) => {
          formData.append(`bind[${bindKey}]`, bindValue);
        }
      );
    } else {
      formData.append(key, String(value));
    }
  });

  return formData;
}

