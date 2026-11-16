import { useState } from "react";
import { Menu, X } from "lucide-react";

import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F7F9]">
      {/* خلفية عند فتح القائمة على الهاتف */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}

      {/* القائمة الجانبية */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* المحتوى الرئيسي */}
      <div className="min-h-screen md:mr-64">
        {/* زر القائمة على الهاتف */}
        <div className="flex items-center justify-between bg-white p-4 shadow-sm md:hidden">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="rounded-lg bg-[#0D3043] p-2 text-white"
          >
            {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <span className="font-bold text-[#0D3043]">لوحة تحكم سيرنا</span>
        </div>

        <Header />

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
