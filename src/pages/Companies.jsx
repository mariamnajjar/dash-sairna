import { useEffect, useState } from "react";

import {
  Search,
  Plus,
  Building2,
  Pencil,
  Trash2,
  X,
  CheckCircle,
  XCircle,
} from "lucide-react";

import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../services/companyService";

export default function Companies() {
  const [companies, setCompanies] = useState([]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [companyName, setCompanyName] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // استخراج رسالة الخطأ
  const getErrorMessage = (err) => {
    const message = err.response?.data?.message;

    return Array.isArray(message)
      ? message.join(" - ")
      : message || "حدث خطأ أثناء تنفيذ العملية.";
  };

  // جلب الشركات من الباك إند
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCompanies();

      // التعامل مع أشكال الاستجابة الشائعة
      const data = Array.isArray(response)
        ? response
        : response?.data || response?.companies || [];

      setCompanies(data);
      // console.log("بيانات الشركات:", data);
    } catch (err) {
      console.error("Companies Error:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // البحث
  const filteredCompanies = companies.filter((company) =>
    company.name?.toLowerCase().includes(search.toLowerCase()),
  );

  // فتح نافذة الإضافة
  const openAddModal = () => {
    setEditingCompany(null);
    setCompanyName("");
    setError("");
    setShowModal(true);
  };

  // فتح نافذة التعديل
  const openEditModal = (company) => {
    setEditingCompany(company);
    setCompanyName(company.name || "");
    setError("");
    setShowModal(true);
  };

  // إضافة أو تعديل شركة
  const saveCompany = async (e) => {
    e.preventDefault();

    if (!companyName.trim()) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingCompany) {
        await updateCompany(editingCompany.id, {
          name: companyName.trim(),
        });

        setSuccess("تم تعديل بيانات الشركة بنجاح.");
      } else {
        await createCompany({
          name: companyName.trim(),
        });

        setSuccess("تمت إضافة الشركة بنجاح.");
      }

      setShowModal(false);
      setCompanyName("");

      await fetchCompanies();
    } catch (err) {
      console.error("Save Company Error:", err);
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  // أرشفة شركة
  const handleDeleteCompany = async (id) => {
    const confirmed = window.confirm("هل أنت متأكدة من أرشفة هذه الشركة؟");

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deleteCompany(id);

      setSuccess("تمت أرشفة الشركة بنجاح.");

      await fetchCompanies();
    } catch (err) {
      console.error("Delete Company Error:", err);
      setError(getErrorMessage(err));
    }
  };

  // تفعيل أو إيقاف شركة
  const toggleStatus = async (company) => {
    try {
      setError("");
      setSuccess("");

      await updateCompany(company.id, {
        isActive: !company.isActive,
      });

      setSuccess("تم تحديث حالة الشركة بنجاح.");

      await fetchCompanies();
    } catch (err) {
      console.error("Update Status Error:", err);
      setError(getErrorMessage(err));
    }
  };

  const activeCount = companies.filter((company) => company.isActive).length;

  const inactiveCount = companies.length - activeCount;

  return (
    <div className="space-y-6">
      {/* عنوان الصفحة */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0D3043]">
            إدارة شركات النقل
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            إدارة شركات النقل المسجلة في منصة سيرنا.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-[#16A6A1] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#128b87]"
        >
          <Plus size={19} />
          إضافة شركة
        </button>
      </div>

      {/* رسائل النجاح والخطأ */}
      {success && (
        <div className="rounded-xl bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      {error && !showModal && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">إجمالي الشركات</p>

          <h2 className="mt-2 text-3xl font-extrabold text-[#0D3043]">
            {loading ? "..." : companies.length}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">الشركات النشطة</p>

          <h2 className="mt-2 text-3xl font-extrabold text-green-600">
            {loading ? "..." : activeCount}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">الشركات المتوقفة</p>

          <h2 className="mt-2 text-3xl font-extrabold text-red-500">
            {loading ? "..." : inactiveCount}
          </h2>
        </div>
      </div>

      {/* جدول الشركات */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="relative max-w-md">
          <Search
            size={19}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="ابحث عن شركة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 py-3 pr-10 pl-4 text-sm outline-none focus:border-[#16A6A1]"
          />
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[650px] text-right">
            <thead>
              <tr className="border-b border-gray-100 text-sm text-gray-500">
                <th className="px-4 py-4 font-semibold">الشركة</th>

                <th className="px-4 py-4 font-semibold">عدد الرحلات</th>

                <th className="px-4 py-4 font-semibold">الحالة</th>

                <th className="px-4 py-4 font-semibold">الإجراءات</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-gray-400">
                    جارٍ تحميل الشركات...
                  </td>
                </tr>
              )}

              {!loading &&
                filteredCompanies.map((company) => (
                  <tr
                    key={company.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/70"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-[#E8F7F6] text-lg font-extrabold text-[#16A6A1]">
                          {company.logoUrl ? (
                            <img
                              src={company.logoUrl}
                              alt={company.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            company.name?.charAt(0) || <Building2 size={20} />
                          )}
                        </div>

                        <span className="font-bold text-[#243746]">
                          {company.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">—</td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                          company.isActive
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-500"
                        }`}
                      >
                        {company.isActive ? (
                          <CheckCircle size={14} />
                        ) : (
                          <XCircle size={14} />
                        )}

                        {company.isActive ? "نشطة" : "متوقفة"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(company)}
                          title="تعديل"
                          className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() => toggleStatus(company)}
                          title={
                            company.isActive ? "إيقاف الشركة" : "تفعيل الشركة"
                          }
                          className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 hover:bg-amber-100"
                        >
                          {company.isActive ? "إيقاف" : "تفعيل"}
                        </button>

                        <button
                          onClick={() => handleDeleteCompany(company.id)}
                          title="أرشفة"
                          className="rounded-lg bg-red-50 p-2 text-red-500 hover:bg-red-100"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {!loading && filteredCompanies.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-gray-400">
                    لا توجد شركات مطابقة للبحث.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* نافذة إضافة وتعديل الشركة */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-[#0D3043]">
                {editingCompany ? "تعديل الشركة" : "إضافة شركة جديدة"}
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={saveCompany}>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                اسم الشركة
              </label>

              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="أدخل اسم الشركة"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#16A6A1]"
              />

              <div className="mt-6 flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-[#16A6A1] py-3 font-bold text-white hover:bg-[#128b87] disabled:opacity-60"
                >
                  {saving ? "جارٍ الحفظ..." : "حفظ"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                  className="flex-1 rounded-xl bg-gray-100 py-3 font-bold text-gray-600 hover:bg-gray-200"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
