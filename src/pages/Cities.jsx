import { useEffect, useState } from "react";
import { Search, MapPin, Building2, Navigation } from "lucide-react";
import { getCities } from "../services/cityService.js";

export default function Cities() {
  const [cities, setCities] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // استخراج قائمة المدن من استجابة الباك إند
  const extractCities = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.cities)) return data.cities;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  // جلب المدن من الباك إند
  const fetchCities = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCities();

      console.log("بيانات المدن:", data);

      setCities(extractCities(data));
    } catch (err) {
      console.error("Cities Error:", err);
      console.error("Server response:", err.response?.data);

      setError(err.response?.data?.message || "حدث خطأ أثناء تحميل المدن.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  // البحث عن مدينة
  const filteredCities = cities.filter((city) => {
    const name = String(city.name || "").toLowerCase();
    const searchValue = search.toLowerCase();

    return name.includes(searchValue);
  });

  return (
    <div className="space-y-6">
      {/* عنوان الصفحة */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#0D3043]">
          المدن والمحافظات
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          استعراض المدن والمحافظات المعتمدة في منصة سيرنا.
        </p>
      </div>

      {/* الإحصائيات */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">عدد المدن</p>
            <MapPin size={23} className="text-[#16A6A1]" />
          </div>

          <h2 className="mt-3 text-3xl font-extrabold text-[#0D3043]">
            {loading ? "..." : cities.length}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">المدن الظاهرة</p>
            <Navigation size={23} className="text-green-500" />
          </div>

          <h2 className="mt-3 text-3xl font-extrabold text-green-600">
            {loading ? "..." : filteredCities.length}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">مصدر البيانات</p>
            <Building2 size={23} className="text-amber-500" />
          </div>

          <h2 className="mt-3 text-lg font-extrabold text-amber-600">
            قاعدة البيانات
          </h2>
        </div>
      </div>

      {/* قائمة المدن */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-extrabold text-[#0D3043]">قائمة المدن</h2>

          <p className="mt-1 text-sm text-gray-400">
            المدن المتاحة لاستخدامها في تحديد مسارات الرحلات.
          </p>
        </div>

        {/* البحث */}
        <div className="relative max-w-md">
          <Search
            size={19}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="ابحث عن مدينة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 py-3 pr-10 pl-4 text-sm outline-none focus:border-[#16A6A1]"
          />
        </div>

        {/* بطاقات المدن */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <div className="col-span-full py-10 text-center text-gray-400">
              جارٍ تحميل المدن...
            </div>
          ) : error ? (
            <div className="col-span-full py-10 text-center text-red-500">
              <p>{error}</p>

              <button
                onClick={fetchCities}
                className="mt-3 text-[#16A6A1] underline"
              >
                إعادة المحاولة
              </button>
            </div>
          ) : (
            filteredCities.map((city) => (
              <div
                key={city.id}
                className="rounded-2xl border border-gray-100 p-5 transition hover:-translate-y-1 hover:border-[#16A6A1]/40 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F7F6] text-[#16A6A1]">
                    <MapPin size={23} />
                  </div>

                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
                    متاحة
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-extrabold text-[#0D3043]">
                  {city.name || "مدينة بدون اسم"}
                </h3>

                <p className="mt-1 text-sm text-gray-400">
                  {city.region || "المحافظة المعتمدة في النظام"}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-sm text-gray-500">رقم المدينة</span>

                  <span className="font-extrabold text-[#16A6A1]">
                    {city.id}
                  </span>
                </div>
              </div>
            ))
          )}

          {!loading && !error && filteredCities.length === 0 && (
            <div className="col-span-full py-10 text-center text-gray-400">
              لم يتم العثور على مدينة مطابقة للبحث.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
