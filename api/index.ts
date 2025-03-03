import axios from "axios";

export const BASE_URL  = import.meta.env.VITE_BASE_URL;

export const api = axios.create({baseURL : BASE_URL , timeout : 5000 })
