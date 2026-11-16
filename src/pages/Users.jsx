import { useEffect, useState } from "react";

import {
  Search,
  Eye,
  X,
  Users as UsersIcon,
  UserRound,
  Phone,
  Mail,
  CalendarDays,
} from "lucide-react";

import { getUsers, getUserById } from "../services/userService";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [error, setError] = useState("");
  const [detailsError, setDetailsError] = useState("");

  // استخراج قائمة المستخدمين من استجابة API
  const extractUsers = (data) => {
    if (Array.isArray(data)) return data;

    if (Array.isArray(data?.users)) return data.users;

    if (Array.isArray(data?.data)) return data.data;

    return [];
  };

  // ترجمة نوع الحساب
  const translateRole = (role) => {
    const roles = {
      USER: "مستخدم",
      ADMIN: "مدير",
    };

    return roles[role] || role || "غير محدد";
  };

  // تنسيق التاريخ
  const formatDate = (date) => {
    if (!date) return "غير محدد";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("ar-SY");
  };

  // جلب المستخدمين من الباك إند
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getUsers();

      setUsers(extractUsers(data));
    } catch (err) {
      console.error("Users API Error:", err);

      setError(
        err.response?.data?.message || "حدث خطأ أثناء تحميل المستخدمين.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // البحث
  const filteredUsers = users.filter((user) => {
    const name = String(user.name || "").toLowerCase();
    const email = String(user.email || "").toLowerCase();
    const role = String(user.role || "").toLowerCase();

    const searchValue = search.toLowerCase();

    return (
      name.includes(searchValue) ||
      email.includes(searchValue) ||
      role.includes(searchValue)
    );
  });

  // عرض تفاصيل المستخدم من API
  const showUserDetails = async (user) => {
    try {
      setSelectedUser(user);
      setDetailsLoading(true);
      setDetailsError("");

      const data = await getUserById(user.id);

      const details = data?.user || data?.data || data;

      setSelectedUser(details);
    } catch (err) {
      console.error("User Details Error:", err);

      setDetailsError("تعذر تحميل تفاصيل المستخدم.");
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* عنوان الصفحة */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#0D3043]">
          إدارة المستخدمين
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          الاطلاع على بيانات المستخدمين المسجلين في منصة سيرنا.
        </p>
      </div>

      {/* الإحصائيات */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">إجمالي المستخدمين</p>

            <UsersIcon size={23} className="text-[#16A6A1]" />
          </div>

          <h2 className="mt-3 text-3xl font-extrabold text-[#0D3043]">
            {users.length}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">المستخدمون الظاهرون</p>

            <UserRound size={23} className="text-green-500" />
          </div>

          <h2 className="mt-3 text-3xl font-extrabold text-green-600">
            {filteredUsers.length}
          </h2>
        </div>
      </div>

      {/* البحث والجدول */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="relative max-w-md">
          <Search
            size={19}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="ابحث بالاسم أو البريد الإلكتروني..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 py-3 pr-10 pl-4 text-sm outline-none focus:border-[#16A6A1]"
          />
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[700px] text-right">
            <thead>
              <tr className="border-b border-gray-100 text-sm text-gray-500">
                <th className="px-4 py-4">المستخدم</th>
                <th className="px-4 py-4">نوع الحساب</th>
                <th className="px-4 py-4">تاريخ التسجيل</th>
                <th className="px-4 py-4">التفاصيل</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-gray-400">
                    جارٍ تحميل المستخدمين...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-red-500">
                    {error}
                    <button
                      onClick={fetchUsers}
                      className="mr-3 text-[#16A6A1] underline"
                    >
                      إعادة المحاولة
                    </button>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/70"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F7F6] font-bold text-[#16A6A1]">
                          {user.name?.charAt(0) || "؟"}
                        </div>

                        <div>
                          <p className="font-bold text-[#243746]">
                            {user.name || "غير محدد"}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {user.email || "غير محدد"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                        {translateRole(user.role)}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {formatDate(user.createdAt)}
                    </td>

                    <td className="px-4 py-4">
                      <button
                        onClick={() => showUserDetails(user)}
                        title="عرض التفاصيل"
                        className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}

              {!loading && !error && filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-gray-400">
                    لا يوجد مستخدمون مطابقون للبحث.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* نافذة تفاصيل المستخدم */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-[#0D3043]">
                بيانات المستخدم
              </h2>

              <button
                onClick={() => {
                  setSelectedUser(null);
                  setDetailsError("");
                }}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {detailsLoading ? (
              <div className="py-12 text-center text-gray-400">
                جارٍ تحميل بيانات المستخدم...
              </div>
            ) : detailsError ? (
              <div className="py-10 text-center text-red-500">
                {detailsError}
              </div>
            ) : (
              <>
                <div className="mb-6 flex flex-col items-center rounded-xl bg-[#F4F7F9] p-5">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#16A6A1] text-2xl font-bold text-white">
                    {selectedUser.name?.charAt(0) || "؟"}
                  </div>

                  <h3 className="mt-3 text-lg font-extrabold text-[#0D3043]">
                    {selectedUser.name || "غير محدد"}
                  </h3>

                  <span className="mt-1 text-sm text-gray-500">
                    {translateRole(selectedUser.role)}
                  </span>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <Mail className="text-[#16A6A1]" size={19} />

                    <div>
                      <p className="text-xs text-gray-400">البريد الإلكتروني</p>

                      <p className="text-sm font-semibold text-[#243746]">
                        {selectedUser.email || "غير محدد"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="text-[#16A6A1]" size={19} />

                    <div>
                      <p className="text-xs text-gray-400">رقم الهاتف</p>

                      <p className="text-sm font-semibold text-[#243746]">
                        {selectedUser.phone || "غير محدد"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CalendarDays className="text-[#16A6A1]" size={19} />

                    <div>
                      <p className="text-xs text-gray-400">تاريخ التسجيل</p>

                      <p className="text-sm font-semibold text-[#243746]">
                        {formatDate(selectedUser.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            <button
              onClick={() => {
                setSelectedUser(null);
                setDetailsError("");
              }}
              className="mt-7 w-full rounded-xl bg-[#0D3043] py-3 font-bold text-white hover:bg-[#16465f]"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
