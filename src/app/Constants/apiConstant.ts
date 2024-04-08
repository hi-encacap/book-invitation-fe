export const LANGUAGE_API_PATH = {
  LANGUAGES: "languages",
  LANGUAGE: "language",
  LANGUAGE_ID: "language/:id",
};

export const CONFIG_API_PATH = {
  CONFIGS: "api/configs",
};

export const AUTH_API_PATH = {
  LOGIN: "api/login",
  REGISTER: "api/register",
  FORGET_PASSWORD: "auth/forget-password",
  RESET_PASSWORD: "auth/reset-password",
  REFRESH_TOKEN: "api/refresh",
  ME: "api/me",
};

export const COMMON_API_PATH = {
  UPLOAD_IMAGE: "v1/upload",
};

export const CATEGORY_API_PATH = {
  CATEGORIES: "api/categories",
  CATEGORY: "api/category",
  CATEGORY_ID: (id: number) => `api/category/${id}`,
};

export const USER_API_PATH = {
  USERS: "api/users",
  USER: "api/user",
  USER_ID: (id: number) => `api/user/${id}`,
};

export const PRODUCT_API_PATH = {
  PRODUCTS: "api/products",
  PRODUCT: "api/product",
  PRODUCT_ID: (id: number) => `api/product/${id}`,
};
