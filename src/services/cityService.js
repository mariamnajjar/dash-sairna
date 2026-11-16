import api from "./api";

// جلب المدن والمحافظات
export const getCities = async () => {
  const response = await api.get("/dashboard/cities");
  return response.data;
};
