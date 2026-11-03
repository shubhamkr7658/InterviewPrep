export const PROD_URL = "https://interviewprepaibackend.onrender.com";
export const LOCAL_URL = window.location.hostname === 'localhost' ? "http://localhost:8000" : `http://${window.location.hostname}:8000`;

export const BASE_URL = window.location.hostname === 'localhost' ? LOCAL_URL : PROD_URL;

export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login",
        GET_PROFILE: "/api/auth/profile",
        UPLOAD_IMAGE: "/api/auth/upload-image",
        UPDATE_PROFILE: "/api/auth/update-profile",
    },
    SESSION: {
        CREATE: "/api/sessions/create",
        GET_ALL: "/api/sessions/my-sessions",
        GET_ONE: (id) => `/api/sessions/${id}`,
        DELETE: (id) => `/api/sessions/${id}`,
    },
    QUESTION: {
        ADD: "/api/questions/add",
        EXPLAIN: "/api/questions/explain",
        PIN: (id) => `/api/questions/${id}/pin`,
        UPDATE_NOTE: (id) => `/api/questions/${id}/note`,
    },
    AI: {
        GENERATE_QUESTIONS: "/api/ai/generate-questions",
        GENERATE_EXPLANATION: "/api/ai/generate-explanation",
        EVALUATE_ANSWER: "/api/ai/evaluate-answer",
    },
};
