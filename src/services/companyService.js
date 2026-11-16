import api from "./api";

// جلب جميع شركات النقل
export const getCompanies = async () => {
  const response = await api.get("/dashboard/companies");
  return response.data;
};

// إضافة شركة جديدة
export const createCompany = async (companyData) => {
  const response = await api.post("/dashboard/companies", companyData);

  return response.data;
};

// تعديل بيانات شركة
export const updateCompany = async (id, companyData) => {
  const response = await api.patch(`/dashboard/companies/${id}`, companyData);

  return response.data;
};

// أرشفة شركة
export const deleteCompany = async (id) => {
  const response = await api.delete(`/dashboard/companies/${id}`);

  return response.data;
};
