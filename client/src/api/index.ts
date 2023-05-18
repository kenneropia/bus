import axios from "axios";
import { z } from "zod";

const API = axios.create({
  baseURL:
    process.env.NODE_ENV == "development"
      ? "http://localhost:3000/api"
      : "https://bus-5htr.onrender.com/api",
  headers: {
    "Content-type": "application/json",
  },
});

API.interceptors.request.use((req) => {
  req.headers.authorization = `Bearer ${
    JSON.parse(localStorage.getItem("user") as string)?.token
  }`;

  return req;
});
API.interceptors.response.use((res) => {
  return res;
});

export default API;
