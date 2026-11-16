import { useEffect, useState } from "react";
import { Bus, Ticket, Users, Building2, TrendingUp } from "lucide-react";

import { getDashboardOverview } from "../services/dashboardService";

export default function DashboardHome() {
  const [stats, setStats] = useState({
    companies: 0,
    confirmedBookings: 0,
    customers: 0,
    totalBookings: 0,
    upcomingTrips: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const data = await getDashboardOverview();

        setStats(data);
      } catch (err) {
        console.error("Dashboard Error:", err);

        setError("تعذر تحميل إحصائيات لوحة التحكم.");
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  const cards = [
    {
      title: "الرحلات القادمة",
      value: stats.upcomingTrips,
      icon: Bus,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "إجمالي الحجوزات",
      value: stats.totalBookings,
      icon: Ticket,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "العملاء",
      value: stats.customers,
      icon: Users,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "شركات النقل",
      value: stats.companies,
      icon: Building2,
      color: "bg-orange-50 text-orange-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* عنوان الصفحة */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#0D3043]">الرئيسية</h1>

        <p className="mt-2 text-sm text-gray-500">
          نظرة عامة على أداء منصة سيرنا
        </p>
      </div>

      {/* حالة التحميل */}
      {loading && <p className="text-gray-500">جارٍ تحميل الإحصائيات...</p>}

      {error && (
        <p className="rounded-xl bg-red-50 p-4 text-red-600">{error}</p>
      )}

      {/* بطاقات الإحصائيات */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card, index) => {
              const Icon = card.icon;

              return (
                <div
                  key={index}
                  className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {card.title}
                      </p>

                      <h2 className="mt-3 text-3xl font-extrabold text-[#0D3043]">
                        {card.value}
                      </h2>
                    </div>

                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${card.color}`}
                    >
                      <Icon size={27} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* الحجوزات المؤكدة */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-[#16A6A1]">
                <TrendingUp size={24} />
              </div>

              <div>
                <p className="text-sm text-gray-500">الحجوزات المؤكدة</p>

                <h3 className="mt-1 text-2xl font-bold text-[#0D3043]">
                  {stats.confirmedBookings}
                </h3>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
