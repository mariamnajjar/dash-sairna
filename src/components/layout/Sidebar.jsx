import {
  LayoutDashboard,
  Bus,
  Ticket,
  Users,
  Building2,
  MapPin,
  Settings,
  LogOut,
  Route,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

const menuItems = [
  { title: "الرئيسية", icon: LayoutDashboard, path: "/" },
  { title: "الرحلات", icon: Bus, path: "/trips" },
  { title: "الحجوزات", icon: Ticket, path: "/bookings" },
  { title: "شركات النقل", icon: Building2, path: "/companies" },
  { title: "المستخدمون", icon: Users, path: "/users" },
  { title: "المدن والمحافظات", icon: MapPin, path: "/cities" },
];

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("sairna_token");
    localStorage.removeItem("sairna_user");

    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
      isActive
        ? "bg-[#16A6A1] text-white"
        : "text-white/70 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <aside
      className={`
        fixed right-0 top-0 z-50
        flex h-screen w-64 flex-col
        bg-[#0D3043] text-white
        transition-transform duration-300
        ${isOpen ? "translate-x-0" : "translate-x-full"}
        md:translate-x-0
      `}
    >
      {/* الشعار */}
      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#16A6A1]">
          <Route size={25} />
        </div>

        <div>
          <h1 className="text-xl font-extrabold">سيرنا</h1>
          <p className="text-xs text-white/60">لوحة التحكم</p>
        </div>
      </div>

      {/* القائمة الرئيسية */}
      <nav className="flex-1 space-y-2 overflow-y-auto p-4">
        <p className="mb-4 px-3 text-xs text-white/40">القائمة الرئيسية</p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={onClose}
              className={linkClass}
            >
              <Icon size={20} />

              <span className="text-sm font-semibold">{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* الإعدادات وتسجيل الخروج */}
      <div className="border-t border-white/10 p-4">
        <NavLink to="/settings" onClick={onClose} className={linkClass}>
          <Settings size={20} />
          <span>الإعدادات</span>
        </NavLink>

        <button
          onClick={handleLogout}
          className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-300 transition hover:bg-white/10"
        >
          <LogOut size={20} />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
