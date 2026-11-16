import api from "./api";

// جلب جميع الحجوزات
export const getBookings = async () => {
  const response = await api.get("/dashboard/bookings");
  return response.data;
};

// جلب تفاصيل حجز محدد
export const getBookingById = async (id) => {
  const response = await api.get(`/dashboard/bookings/${id}`);
  return response.data;
};

// إلغاء حجز
export const cancelBooking = async (id) => {
  const response = await api.post(`/dashboard/bookings/${id}/cancel`);

  return response.data;
};
