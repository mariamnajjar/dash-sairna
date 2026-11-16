import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  X,
  Ticket,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react";

import {
  getBookings,
  getBookingById,
  cancelBooking as cancelBookingAPI,
} from "../services/bookingService.js";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // استخراج النص من القيم التي قد تكون كائنات
  const safeDisplay = (value, fallback = "غير محدد") => {
    if (value === null || value === undefined || value === "") {
      return fallback;
    }

    if (typeof value === "string" || typeof value === "number") {
      return value;
    }

    if (Array.isArray(value)) {
      return (
        value
          .map((item) => safeDisplay(item, ""))
          .filter(Boolean)
          .join("، ") || fallback
      );
    }

    if (typeof value === "object") {
      const possibleValues = [
        value.name,
        value.fullName,
        value.passengerName,
        value.customerName,
        value.phone,
        value.phoneNumber,
        value.seatNumber,
        value.number,
        value.title,
        value.value,
      ];

      for (const item of possibleValues) {
        if (item !== undefined && item !== null && typeof item !== "object") {
          return item;
        }
      }

      return fallback;
    }

    return fallback;
  };

  // استخراج قائمة الحجوزات
  const extractList = (response) => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.bookings)) return response.bookings;
    if (Array.isArray(response?.data?.bookings)) {
      return response.data.bookings;
    }

    return [];
  };

  // تحويل الحالات إلى العربية
  const translateStatus = (status) => {
    const value = String(status ?? "").toUpperCase();

    if (["CONFIRMED", "COMPLETED"].includes(value)) {
      return "مؤكد";
    }

    if (["PENDING", "WAITING"].includes(value)) {
      return "قيد الانتظار";
    }

    if (["CANCELLED", "CANCELED"].includes(value)) {
      return "ملغى";
    }

    return safeDisplay(status, "غير محدد");
  };

  // تجهيز بيانات الحجز للعرض

  // تجهيز بيانات الحجز للعرض
  const formatBooking = (booking) => {
    if (!booking || typeof booking !== "object") {
      return {};
    }

    const trip = booking.trip || {};
    const user = booking.user || {};
    const seats = Array.isArray(booking.seats) ? booking.seats : [];

    const firstSeat = seats[0] || {};

    const origin =
      trip.origin?.name ||
      booking.origin?.name ||
      trip.origin ||
      booking.origin ||
      "غير محدد";

    const destination =
      trip.destination?.name ||
      booking.destination?.name ||
      trip.destination ||
      booking.destination ||
      "غير محدد";

    const company =
      trip.company?.name ||
      booking.company?.name ||
      trip.company ||
      booking.company ||
      "غير محدد";

    const departureAt =
      trip.departureAt ||
      booking.departureAt ||
      booking.travelDate ||
      booking.date;

    const passengerNames = seats
      .map((seat) => seat.passengerName)
      .filter(Boolean);

    const passengerPhones = seats
      .map((seat) => seat.passengerPhone)
      .filter(Boolean);

    const seatNumbers = seats
      .map((seat) => seat.seatNumber)
      .filter((number) => number !== undefined && number !== null);

    const id =
      booking.id ??
      booking.bookingId ??
      booking.bookingNumber ??
      booking.reference ??
      "—";

    return {
      ...booking,

      id,

      passenger:
        passengerNames.length > 0
          ? passengerNames.join("، ")
          : user.name || "غير محدد",

      phone:
        passengerPhones.length > 0 ? passengerPhones.join("، ") : "غير محدد",

      company: safeDisplay(company),

      origin: safeDisplay(origin),

      destination: safeDisplay(destination),

      date: departureAt,

      seats:
        seatNumbers.length > 0
          ? `${seatNumbers.length} (المقاعد: ${seatNumbers.join("، ")})`
          : seats.length > 0
            ? seats.length
            : "—",

      total:
        booking.totalPrice ??
        booking.total ??
        booking.amount ??
        booking.price ??
        0,

      status: translateStatus(booking.status),
    };
  };

  // جلب الحجوزات
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getBookings();
      const list = extractList(response);

      setBookings(list.map(formatBooking));
    } catch (err) {
      console.error("Bookings error:", err);
      console.error("Server response:", err.response?.data);

      setError("تعذر تحميل الحجوزات. يرجى المحاولة مجدداً.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // تنسيق التاريخ
  const formatDate = (date) => {
    const value = safeDisplay(date, "");

    if (!value) return "غير محدد";

    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
      return value;
    }

    return parsedDate.toLocaleDateString("ar-SY");
  };

  // تنسيق المبلغ
  const formatPrice = (price) => {
    const value = Number(
      typeof price === "object" && price !== null
        ? (price.amount ?? price.value ?? 0)
        : (price ?? 0),
    );

    if (!Number.isFinite(value)) {
      return "غير محدد";
    }

    return new Intl.NumberFormat("ar-SY").format(value) + " ل.س";
  };

  // البحث والتصفية
  const filteredBookings = bookings.filter((booking) => {
    const searchValue = search.trim().toLowerCase();

    const matchesSearch =
      String(booking.passenger).toLowerCase().includes(searchValue) ||
      String(booking.id).toLowerCase().includes(searchValue) ||
      String(booking.phone).toLowerCase().includes(searchValue);

    const matchesStatus =
      statusFilter === "الكل" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // الإحصائيات
  const confirmedCount = bookings.filter(
    (booking) => booking.status === "مؤكد",
  ).length;

  const pendingCount = bookings.filter(
    (booking) => booking.status === "قيد الانتظار",
  ).length;

  const cancelledCount = bookings.filter(
    (booking) => booking.status === "ملغى",
  ).length;

  // ألوان الحالات
  const statusStyle = (status) => {
    if (status === "مؤكد") {
      return "bg-green-50 text-green-600";
    }

    if (status === "قيد الانتظار") {
      return "bg-amber-50 text-amber-600";
    }

    return "bg-red-50 text-red-500";
  };

  // عرض تفاصيل الحجز
  const handleShowDetails = async (booking) => {
    setSelectedBooking(booking);
    setDetailsLoading(true);
    setError("");

    try {
      const response = await getBookingById(booking.id);

      const details =
        response?.data?.booking ||
        response?.data ||
        response?.booking ||
        response;

      if (details && typeof details === "object") {
        setSelectedBooking(formatBooking(details));
      }
    } catch (err) {
      console.error("Booking details error:", err);
      console.error("Server response:", err.response?.data);

      // الاحتفاظ ببيانات الحجز الموجودة في القائمة
    } finally {
      setDetailsLoading(false);
    }
  };

  // إلغاء الحجز
  const handleCancelBooking = async (id) => {
    const confirmed = window.confirm("هل أنت متأكد من إلغاء هذا الحجز؟");

    if (!confirmed) return;

    try {
      setCancelling(true);
      setError("");

      await cancelBookingAPI(id);

      setSuccess("تم إلغاء الحجز بنجاح.");
      setSelectedBooking(null);

      await fetchBookings();
    } catch (err) {
      console.error("Cancel booking error:", err);
      console.error("Server response:", err.response?.data);

      setError(
        err.response?.data?.message ||
          "تعذر إلغاء الحجز. يرجى المحاولة مجدداً.",
      );
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* عنوان الصفحة */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#0D3043]">
          إدارة الحجوزات
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          متابعة حجوزات المسافرين وإدارة حالاتها.
        </p>
      </div>

      {/* رسائل التنبيه */}
      {error && (
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">إجمالي الحجوزات</p>
            <Ticket className="text-[#16A6A1]" size={22} />
          </div>

          <h2 className="mt-3 text-3xl font-extrabold text-[#0D3043]">
            {bookings.length}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">الحجوزات المؤكدة</p>
            <CheckCircle className="text-green-500" size={22} />
          </div>

          <h2 className="mt-3 text-3xl font-extrabold text-green-600">
            {confirmedCount}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">قيد الانتظار</p>
            <Clock className="text-amber-500" size={22} />
          </div>

          <h2 className="mt-3 text-3xl font-extrabold text-amber-600">
            {pendingCount}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">الحجوزات الملغاة</p>
            <XCircle className="text-red-500" size={22} />
          </div>

          <h2 className="mt-3 text-3xl font-extrabold text-red-500">
            {cancelledCount}
          </h2>
        </div>
      </div>

      {/* البحث والتصفية */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search
              size={19}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="ابحث باسم المسافر أو رقم الحجز..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 py-3 pr-10 pl-4 text-sm outline-none focus:border-[#16A6A1]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#16A6A1]"
          >
            <option value="الكل">جميع الحالات</option>
            <option value="مؤكد">مؤكد</option>
            <option value="قيد الانتظار">قيد الانتظار</option>
            <option value="ملغى">ملغى</option>
          </select>
        </div>

        {/* جدول الحجوزات */}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[850px] text-right">
            <thead>
              <tr className="border-b border-gray-100 text-sm text-gray-500">
                <th className="px-4 py-4">رقم الحجز</th>
                <th className="px-4 py-4">المسافر</th>
                <th className="px-4 py-4">مسار الرحلة</th>
                <th className="px-4 py-4">تاريخ الرحلة</th>
                <th className="px-4 py-4">المبلغ</th>
                <th className="px-4 py-4">الحالة</th>
                <th className="px-4 py-4">التفاصيل</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-400">
                    <Loader2 className="mx-auto animate-spin" />
                    <p className="mt-2">جارٍ تحميل الحجوزات...</p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/70"
                  >
                    <td className="px-4 py-4 font-bold text-[#16A6A1]">
                      {safeDisplay(booking.id)}
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-bold text-[#243746]">
                        {safeDisplay(booking.passenger)}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {safeDisplay(booking.phone)}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {safeDisplay(booking.origin)} ←{" "}
                      {safeDisplay(booking.destination)}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {formatDate(booking.date)}
                    </td>

                    <td className="px-4 py-4 text-sm font-bold text-[#243746]">
                      {formatPrice(booking.total)}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle(
                          booking.status,
                        )}`}
                      >
                        {safeDisplay(booking.status)}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleShowDetails(booking)}
                        title="عرض التفاصيل"
                        className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}

              {!loading && filteredBookings.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-gray-400">
                    لا توجد حجوزات مطابقة للبحث.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* نافذة تفاصيل الحجز */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-[#0D3043]">
                تفاصيل الحجز
              </h2>

              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {detailsLoading ? (
              <div className="py-10 text-center text-gray-400">
                <Loader2 className="mx-auto animate-spin" />
                <p className="mt-2">جارٍ تحميل التفاصيل...</p>
              </div>
            ) : (
              <>
                <div className="rounded-xl bg-[#F4F7F9] p-4">
                  <p className="text-xs text-gray-500">رقم الحجز</p>

                  <p className="mt-1 font-extrabold text-[#16A6A1]">
                    {safeDisplay(selectedBooking.id)}
                  </p>
                </div>

                <div className="mt-5 space-y-4">
                  {[
                    ["اسم المسافر", selectedBooking.passenger],
                    ["رقم الهاتف", selectedBooking.phone],
                    ["شركة النقل", selectedBooking.company],
                    ["من", selectedBooking.origin],
                    ["إلى", selectedBooking.destination],
                    ["تاريخ الرحلة", formatDate(selectedBooking.date)],
                    ["عدد المقاعد", selectedBooking.seats],
                    ["المبلغ الإجمالي", formatPrice(selectedBooking.total)],
                    ["حالة الحجز", selectedBooking.status],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3"
                    >
                      <span className="text-sm text-gray-500">{label}</span>

                      <span className="text-sm font-bold text-[#243746]">
                        {safeDisplay(value)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex gap-3">
                  {selectedBooking.status !== "ملغى" && (
                    <button
                      onClick={() => handleCancelBooking(selectedBooking.id)}
                      disabled={cancelling}
                      className="flex-1 rounded-xl bg-red-50 py-3 font-bold text-red-500 hover:bg-red-100 disabled:opacity-60"
                    >
                      {cancelling ? "جارٍ الإلغاء..." : "إلغاء الحجز"}
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="flex-1 rounded-xl bg-gray-100 py-3 font-bold text-gray-600 hover:bg-gray-200"
                  >
                    إغلاق
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
