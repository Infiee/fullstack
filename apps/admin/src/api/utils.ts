export const baseUrlApi = (url: string) =>
  process.env.NODE_ENV === "development"
    ? `http://127.0.0.1:3000/${url}`
    : `http://127.0.0.1:3000/${url}`;
