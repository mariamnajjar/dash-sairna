import { useEffect, useState } from "react";

import {
  Bus,
  Plus,
  Search,
  CalendarDays,
  Clock,
  MapPin,
  XCircle,
  Filter,
  X,
  Eye,
  Loader2,
} from "lucide-react";

import {
  getTrips,
  createTrip,
  cancelTrip as cancelTripAPI,
} from "../services/tripService.js";

import { getCompanies } from "../services/companyService.js";
import { getCities } from "../services/cityService.js";

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [cities, setCities] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("الكل");

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    companyId: "",
    originId: "",
    destinationId: "",
    departureAt: "",
    arrivalAt: "",
    price: "",
    totalSeats: "",
  });

  // جلب بيانات الرحلات والشركات والمدن
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [tripsData, companiesData, citiesData] = await Promise.all([
        getTrips(),
        getCompanies(),
        getCities(),
      ]);

      setTrips(Array.isArray(tripsData) ? tripsData : []);
      setCompanies(Array.isArray(companiesData) ? companiesData : []);
      setCities(Array.isArray(citiesData) ? citiesData : []);
    } catch (err) {
      console.error("Error loading trips:", err);
      console.error("Server response:", err.response?.data);
      setError("حدث خطأ أثناء تحميل بيانات الرحلات.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // تغيير قيم النموذج
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // إضافة رحلة جديدة
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.companyId ||
      !formData.originId ||
      !formData.destinationId ||
      !formData.departureAt ||
      !formData.arrivalAt ||
      !formData.price ||
      !formData.totalSeats
    ) {
      setError("يرجى تعبئة جميع الحقول.");
      return;
    }

    if (formData.originId === formData.destinationId) {
      setError("مدينة الانطلاق والوصول يجب أن تكونا مختلفتين.");
      return;
    }

    if (new Date(formData.arrivalAt) <= new Date(formData.departureAt)) {
      setError("موعد الوصول يجب أن يكون بعد موعد الانطلاق.");
      return;
    }

    const tripData = {
      companyId: Number(formData.companyId),
      originId: Number(formData.originId),
      destinationId: Number(formData.destinationId),
      departureAt: new Date(formData.departureAt).toISOString(),
      arrivalAt: new Date(formData.arrivalAt).toISOString(),
      price: Number(formData.price),
      totalSeats: Number(formData.totalSeats),
    };

    try {
      setSaving(true);

      await createTrip(tripData);

      setSuccess("تمت إضافة الرحلة بنجاح.");

      setFormData({
        companyId: "",
        originId: "",
        destinationId: "",
        departureAt: "",
        arrivalAt: "",
        price: "",
        totalSeats: "",
      });

      setShowModal(false);

      await fetchData();
    } catch (err) {
      console.error("Error creating trip:", err);
      console.error("Server response:", err.response?.data);

      setError(
        err.response?.data?.message ||
          "تعذرت إضافة الرحلة. يرجى التأكد من البيانات.",
      );
    } finally {
      setSaving(false);
    }
  };

  // إلغاء رحلة
  const handleCancelTrip = async (id) => {
    const confirmed = window.confirm("هل أنت متأكد من إلغاء هذه الرحلة؟");

    if (!confirmed) return;

    try {
      await cancelTripAPI(id);
      setSuccess("تم إلغاء الرحلة بنجاح.");
      await fetchData();
    } catch (err) {
      console.error("Error cancelling trip:", err);
      setError("حدث خطأ أثناء إلغاء الرحلة.");
    }
  };

  // تنسيق التاريخ
  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("ar-SY");
  };

  // تنسيق الوقت
  const formatTime = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleTimeString("ar-SY", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // تنسيق السعر
  const formatPrice = (price) => {
    return new Intl.NumberFormat("ar-SY").format(price) + " ل.س";
  };

  // البحث والتصفية
  const filteredTrips = trips.filter((trip) => {
    const company = trip.company?.name || "";
    const origin = trip.origin?.name || "";
    const destination = trip.destination?.name || "";

    const matchesSearch =
      company.includes(search) ||
      origin.includes(search) ||
      destination.includes(search);

    const status =
      trip.status === "AVAILABLE"
        ? "متاحة"
        : trip.status === "CANCELLED"
          ? "ملغاة"
          : trip.status;

    const matchesStatus = statusFilter === "الكل" || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const availableTrips = trips.filter((trip) => trip.status === "AVAILABLE");

  const cancelledTrips = trips.filter((trip) => trip.status === "CANCELLED");

  return (
    <div className="space-y-7">
      {/* عنوان الصفحة */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-[#16A6A1]">
            <Bus size={25} />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-[#0D3043]">
              إدارة الرحلات
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              متابعة الرحلات وإدارة مواعيد السفر وشركات النقل.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setError("");
            setSuccess("");
            setShowModal(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-[#16A6A1] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#128d89]"
        >
          <Plus size={20} />
          إضافة رحلة جديدة
        </button>
      </div>

      {/* رسائل التنبيه */}
      {error && !showModal && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* الإحصائيات */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">إجمالي الرحلات</p>
          <h2 className="mt-3 text-3xl font-extrabold text-[#0D3043]">
            {trips.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">الرحلات المتاحة</p>
          <h2 className="mt-3 text-3xl font-extrabold text-green-600">
            {availableTrips.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">الرحلات الملغاة</p>
          <h2 className="mt-3 text-3xl font-extrabold text-red-500">
            {cancelledTrips.length}
          </h2>
        </div>
      </div>

      {/* البحث والتصفية */}
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="relative min-w-[220px] flex-1">
          <Search
            size={19}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="ابحث عن شركة أو مدينة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pr-11 pl-4 text-sm outline-none focus:border-[#16A6A1]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-400" />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none"
          >
            <option value="الكل">جميع الحالات</option>
            <option value="متاحة">متاحة</option>
            <option value="ملغاة">ملغاة</option>
          </select>
        </div>
      </div>

      {/* جدول الرحلات */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-6">
          <h2 className="text-lg font-bold text-[#0D3043]">قائمة الرحلات</h2>

          <p className="mt-1 text-sm text-gray-400">
            عدد النتائج: {filteredTrips.length}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-right">
            <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                <th className="px-5 py-4">شركة النقل</th>
                <th className="px-5 py-4">مسار الرحلة</th>
                <th className="px-5 py-4">موعد الانطلاق</th>
                <th className="px-5 py-4">السعر</th>
                <th className="px-5 py-4">المقاعد</th>
                <th className="px-5 py-4">الحالة</th>
                <th className="px-5 py-4">الإجراءات</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-400">
                    <Loader2 className="mx-auto animate-spin" />
                    <p className="mt-2">جاري تحميل الرحلات...</p>
                  </td>
                </tr>
              ) : (
                filteredTrips.map((trip) => {
                  const status =
                    trip.status === "AVAILABLE" ? "متاحة" : "ملغاة";

                  return (
                    <tr
                      key={trip.id}
                      className="border-t border-gray-100 text-sm hover:bg-gray-50/70"
                    >
                      <td className="px-5 py-5 font-semibold text-[#243746]">
                        {trip.company?.name || "غير محدد"}
                      </td>

                      <td className="px-5 py-5">
                        <div className="flex items-center gap-2 font-semibold">
                          <MapPin size={16} className="text-[#16A6A1]" />
                          {trip.origin?.name || "غير محدد"}
                          <span className="text-gray-400">←</span>
                          {trip.destination?.name || "غير محدد"}
                        </div>
                      </td>

                      <td className="px-5 py-5">
                        <div className="flex items-center gap-2 text-gray-600">
                          <CalendarDays size={16} />
                          {formatDate(trip.departureAt)}
                        </div>

                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                          <Clock size={14} />
                          {formatTime(trip.departureAt)}
                        </div>
                      </td>

                      <td className="px-5 py-5 font-bold text-[#0D3043]">
                        {formatPrice(trip.price)}
                      </td>

                      <td className="px-5 py-5 text-gray-600">
                        {trip.totalSeats} مقعداً
                      </td>

                      <td className="px-5 py-5">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                            status === "متاحة"
                              ? "bg-green-50 text-green-600"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <div className="flex items-center gap-2">
                          <button
                            title="عرض التفاصيل"
                            onClick={() =>
                              alert(
                                `رمز الرحلة: ${trip.code || trip.id}\nموعد الوصول: ${formatDate(trip.arrivalAt)} ${formatTime(trip.arrivalAt)}`,
                              )
                            }
                            className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                          >
                            <Eye size={17} />
                          </button>

                          {trip.status === "AVAILABLE" && (
                            <button
                              title="إلغاء الرحلة"
                              onClick={() => handleCancelTrip(trip.id)}
                              className="rounded-lg bg-red-50 p-2 text-red-500 hover:bg-red-100"
                            >
                              <XCircle size={17} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}

              {!loading && filteredTrips.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-12 text-center text-gray-400"
                  >
                    لا توجد رحلات مطابقة لعملية البحث.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* نافذة إضافة رحلة */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-[#0D3043]">
                إضافة رحلة جديدة
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* شركة النقل */}
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  شركة النقل
                </label>

                <select
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none focus:border-[#16A6A1]"
                >
                  <option value="">اختر شركة النقل</option>

                  {companies
                    .filter((company) => company.isActive !== false)
                    .map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* المدن */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    مدينة الانطلاق
                  </label>

                  <select
                    name="originId"
                    value={formData.originId}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none focus:border-[#16A6A1]"
                  >
                    <option value="">اختر مدينة الانطلاق</option>

                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    مدينة الوصول
                  </label>

                  <select
                    name="destinationId"
                    value={formData.destinationId}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none focus:border-[#16A6A1]"
                  >
                    <option value="">اختر مدينة الوصول</option>

                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* المواعيد */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    موعد الانطلاق
                  </label>

                  <input
                    type="datetime-local"
                    name="departureAt"
                    value={formData.departureAt}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none focus:border-[#16A6A1]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    موعد الوصول
                  </label>

                  <input
                    type="datetime-local"
                    name="arrivalAt"
                    value={formData.arrivalAt}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none focus:border-[#16A6A1]"
                  />
                </div>
              </div>

              {/* السعر والمقاعد */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    سعر الرحلة بالليرة السورية
                  </label>

                  <input
                    type="number"
                    name="price"
                    min="1"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    placeholder="أدخل سعر الرحلة"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none focus:border-[#16A6A1]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    عدد المقاعد
                  </label>

                  <input
                    type="number"
                    name="totalSeats"
                    min="1"
                    value={formData.totalSeats}
                    onChange={handleChange}
                    required
                    placeholder="أدخل عدد المقاعد"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none focus:border-[#16A6A1]"
                  />
                </div>
              </div>

              {/* رسالة الخطأ */}
              {error && (
                <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* الأزرار */}
              <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl px-5 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-[#16A6A1] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#128d89] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && <Loader2 size={17} className="animate-spin" />}
                  {saving ? "جاري الحفظ..." : "حفظ الرحلة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
