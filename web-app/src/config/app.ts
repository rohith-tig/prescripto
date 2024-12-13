import axios from "axios";

const BASE_URL = "http://localhost:8000/api/";
console.log(BASE_URL);

export interface APIResponse<D> {
  data?: D;
  message?: string;
  error?: string;
}

export const api = axios.create({
  baseURL: BASE_URL,
});
