import { Bell, Search, UserCircle } from "lucide-react";

export default function Header() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-gray-100 bg-white px-8">
      <div>
        <h2 className="text-xl font-bold text-[#0D3043]">لوحة التحكم</h2>
        <p className="mt-1 text-sm text-gray-500">
          مرحباً بك في لوحة تحكم سيرنا
        </p>
      </div>

      <div className="flex items-center gap-5">
        <div className="hidden items-center gap-2 rounded-xl bg-gray-50 px-4 py-2 md:flex">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="ابحث هنا..."
            className="w-40 bg-transparent text-sm outline-none"
          />
        </div>

        <button className="relative rounded-xl p-2 text-gray-500 hover:bg-gray-100">
          <Bell size={22} />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-2 border-r border-gray-100 pr-5">
          <UserCircle size={36} className="text-[#16A6A1]" />
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-[#0D3043]">مدير النظام</p>
            <p className="text-xs text-gray-400">مسؤول لوحة التحكم</p>
          </div>
        </div>
      </div>
    </header>
  );
}
