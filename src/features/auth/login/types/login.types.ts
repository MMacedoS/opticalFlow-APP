import type { AuthResponseData } from "@/types/auth.types";

export interface LoginFormValues {
  email: string;
  senha: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  status: number;
  message: string;
  data: AuthResponseData;
}
