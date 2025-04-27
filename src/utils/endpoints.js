import { api } from "./AxiosUtil";

// API endpoints

export const endpoints = {
  quiz: {
    getQuiz: (payload) => api.post("quiz/v1.0/getQuiz", payload),
    submitQuiz: (payload) => api.post("quiz/v1.0/submitQuiz", payload),
    viewQuiz: (payload) => api.post("/quiz/v1.0/viewQuiz", payload),
  },
  auth: {
    register: (payload) => api.post("/public/register", payload),
    login: (payload) => api.post("/public/token", payload),
    authorize: (provider) => api.get("/public/authorize/" + provider),
  }
};
