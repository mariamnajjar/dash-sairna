import api from "./api";

// جلب جميع المستخدمين
export const getUsers = async () => {
  const response = await api.get("/dashboard/users");
  return response.data;
};

// جلب تفاصيل مستخدم محدد
export const getUserById = async (id) => {
  const response = await api.get(`/dashboard/users/${id}`);
  return response.data;
};
