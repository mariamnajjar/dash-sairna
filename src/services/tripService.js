import api from "./api";

// جلب جميع الرحلات
export const getTrips = async () => {
  const response = await api.get("/dashboard/trips");
  return response.data;
};

// إضافة رحلة جديدة
export const createTrip = async (tripData) => {
  const response = await api.post("/dashboard/trips", tripData);
  return response.data;
};

// تعديل بيانات الرحلة
export const updateTrip = async (id, tripData) => {
  const response = await api.patch(`/dashboard/trips/${id}`, tripData);
  return response.data;
};

// إلغاء الرحلة
export const cancelTrip = async (id) => {
  const response = await api.patch(`/dashboard/trips/${id}`, {
    status: "CANCELLED",
  });

  return response.data;
};
