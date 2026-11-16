import axios from "axios";

const api = axios.create({
  baseURL: "https://sairna.abdulrahman-hares.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// إضافة رمز الدخول تلقائيًا مع كل طلب
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sairna_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// التعامل مع انتهاء صلاحية تسجيل الدخول
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("sairna_token");
    }

    return Promise.reject(error);
  },
);

export default api;
