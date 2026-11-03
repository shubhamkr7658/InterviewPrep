import axios from "axios";
import { BASE_URL, PROD_URL, LOCAL_URL } from "./apiPaths";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 60000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor — attach JWT token if present
axiosInstance.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (user?.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — auto-logout on 401 & fallback mechanism
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If it's a network error (e.g. server down, CORS fail) and we haven't retried yet
        if (error.message === "Network Error" && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;

            // Switch baseURL between PROD and LOCAL
            const currentBaseURL = originalRequest.baseURL || axiosInstance.defaults.baseURL;
            const newBaseURL = currentBaseURL === PROD_URL ? LOCAL_URL : PROD_URL;

            originalRequest.baseURL = newBaseURL;
            axiosInstance.defaults.baseURL = newBaseURL;

            return axiosInstance(originalRequest);
        }

        if (error.response?.status === 401) {
            localStorage.removeItem("user");
            sessionStorage.removeItem("hasLoadedApp");
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
