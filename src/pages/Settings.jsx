import { useEffect, useState } from "react";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  ShieldCheck,
  Info,
  Save,
} from "lucide-react";

export default function Settings() {
  const [user, setUser] = useState(null);

  const [settings, setSettings] = useState({
    notifications: true,
    sound: false,
    compactMode: false,
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // جلب بيانات المستخدم المسجل
    const storedUser = localStorage.getItem("sairna_user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }

    // جلب الإعدادات المحفوظة محلياً
    const storedSettings = localStorage.getItem("sairna_settings");

    if (storedSettings) {
      try {
        setSettings((prev) => ({
          ...prev,
          ...JSON.parse(storedSettings),
        }));
      } catch {
        console.error("تعذر قراءة الإعدادات");
      }
    }
  }, []);

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

    setSaved(false);
  };

  const saveSettings = () => {
    localStorage.setItem("sairna_settings", JSON.stringify(settings));

    setSaved(true);
  };

  return (
    <div className="space-y-6">
      {/* عنوان الصفحة */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#0D3043]">الإعدادات</h1>

        <p className="mt-2 text-sm text-gray-500">
          إدارة إعدادات لوحة تحكم سيرنا.
        </p>
      </div>

      {/* بيانات الحساب */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-[#E8F7F6] p-3 text-[#16A6A1]">
            <User size={23} />
          </div>

          <div>
            <h2 className="font-extrabold text-[#0D3043]">معلومات الحساب</h2>

            <p className="text-sm text-gray-400">بيانات المدير المسجل حالياً</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-[#F4F7F9] p-4">
            <p className="text-sm text-gray-400">الاسم</p>

            <p className="mt-2 font-bold text-[#243746]">
              {user?.name || "غير محدد"}
            </p>
          </div>

          <div className="rounded-xl bg-[#F4F7F9] p-4">
            <p className="text-sm text-gray-400">البريد الإلكتروني</p>

            <p className="mt-2 font-bold text-[#243746]">
              {user?.email || "غير محدد"}
            </p>
          </div>

          <div className="rounded-xl bg-[#F4F7F9] p-4">
            <p className="text-sm text-gray-400">نوع الحساب</p>

            <p className="mt-2 font-bold text-[#243746]">
              {user?.role || "ADMIN"}
            </p>
          </div>
        </div>
      </div>

      {/* إعدادات عامة */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-[#E8F7F6] p-3 text-[#16A6A1]">
            <SettingsIcon size={23} />
          </div>

          <div>
            <h2 className="font-extrabold text-[#0D3043]">الإعدادات العامة</h2>

            <p className="text-sm text-gray-400">
              تخصيص تجربة استخدام لوحة التحكم
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {/* الإشعارات */}
          <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-5">
            <div className="flex items-center gap-3">
              <Bell className="text-[#16A6A1]" size={22} />

              <div>
                <p className="font-bold text-[#243746]">تفعيل الإشعارات</p>

                <p className="mt-1 text-xs text-gray-400">
                  تفعيل استقبال إشعارات النظام
                </p>
              </div>
            </div>

            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={() => handleToggle("notifications")}
              className="h-5 w-5 accent-[#16A6A1]"
            />
          </div>

          {/* الصوت */}
          <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-5">
            <div className="flex items-center gap-3">
              <Bell className="text-[#16A6A1]" size={22} />

              <div>
                <p className="font-bold text-[#243746]">أصوات التنبيهات</p>

                <p className="mt-1 text-xs text-gray-400">
                  تفعيل أصوات التنبيه
                </p>
              </div>
            </div>

            <input
              type="checkbox"
              checked={settings.sound}
              onChange={() => handleToggle("sound")}
              className="h-5 w-5 accent-[#16A6A1]"
            />
          </div>

          {/* وضع العرض */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <SettingsIcon className="text-[#16A6A1]" size={22} />

              <div>
                <p className="font-bold text-[#243746]">وضع العرض المختصر</p>

                <p className="mt-1 text-xs text-gray-400">
                  حفظ تفضيل العرض المختصر للوحة التحكم
                </p>
              </div>
            </div>

            <input
              type="checkbox"
              checked={settings.compactMode}
              onChange={() => handleToggle("compactMode")}
              className="h-5 w-5 accent-[#16A6A1]"
            />
          </div>
        </div>

        {/* زر الحفظ */}
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <button
            onClick={saveSettings}
            className="flex items-center gap-2 rounded-xl bg-[#0D3043] px-6 py-3 font-bold text-white transition hover:bg-[#16465f]"
          >
            <Save size={18} />
            حفظ الإعدادات
          </button>

          {saved && (
            <span className="text-sm font-semibold text-green-600">
              تم حفظ الإعدادات بنجاح.
            </span>
          )}
        </div>
      </div>

      {/* معلومات النظام */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-blue-600" size={24} />

          <h2 className="font-extrabold text-[#0D3043]">معلومات النظام</h2>
        </div>

        <div className="mt-4 flex items-start gap-3">
          <Info size={19} className="mt-1 text-blue-500" />

          <div>
            <p className="font-bold text-[#243746]">سيرنا - لوحة التحكم</p>

            <p className="mt-1 text-sm text-gray-500">
              منصة لإدارة الرحلات والحجوزات وشركات النقل والمستخدمين.
            </p>

            <p className="mt-2 text-xs text-gray-400">إصدار الواجهة: 1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
