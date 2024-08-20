"use client"

import axios from "axios";

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    //baseURL: "http://127.0.0.1:8000",
    withCredentials: true
});

