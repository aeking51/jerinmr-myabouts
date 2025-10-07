// Simple hardcoded authentication
// Credentials stored as base64 encoded JSON
const CREDENTIALS = "eyJ1c2VybmFtZSI6ImplcmlubXI1MSIsInBhc3N3b3JkIjoiMTIza2trMTIzJCJ9";

interface Credentials {
  username: string;
  password: string;
}

const decodeCredentials = (): Credentials => {
  try {
    return JSON.parse(atob(CREDENTIALS));
  } catch {
    return { username: "", password: "" };
  }
};

export const validateLogin = (username: string, password: string): boolean => {
  const creds = decodeCredentials();
  return username === creds.username && password === creds.password;
};

export const setAuthToken = () => {
  sessionStorage.setItem("admin_auth", "authenticated");
};

export const clearAuthToken = () => {
  sessionStorage.removeItem("admin_auth");
};

export const isAuthenticated = (): boolean => {
  return sessionStorage.getItem("admin_auth") === "authenticated";
};
