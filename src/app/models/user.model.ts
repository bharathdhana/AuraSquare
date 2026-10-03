export interface User {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}
