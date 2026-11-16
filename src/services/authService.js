import api from "./api";

export const loginAdmin = async (email, password) => {
  const response = await api.post("/dashboard/auth/login", {
    email,
    password,
  });

  return response.data;
};

export const getCurrentAdmin = async () => {
  const response = await api.get("/dashboard/auth/me");

  return response.data;
};
