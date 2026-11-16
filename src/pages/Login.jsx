import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../services/authService";
import { Route, LockKeyhole, Mail } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await loginAdmin(email, password);

      // استخراج رمز الدخول
      const token = response.accessToken;

      if (!token) {
        throw new Error("لم يتم استلام رمز الدخول من الخادم");
      }

      // حفظ رمز الدخول
      localStorage.setItem("sairna_token", token);

      // حفظ بيانات المسؤول
      localStorage.setItem("sairna_user", JSON.stringify(response.user));

      // الانتقال إلى لوحة التحكم
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.response?.data?.message || err.message || "تعذر تسجيل الدخول",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-[#F4F7F9] px-4"
    >
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0D3043] text-white">
            <Route size={32} />
          </div>

          <h1 className="text-3xl font-extrabold text-[#0D3043]">سيرنا</h1>

          <p className="mt-2 text-sm text-gray-500">
            تسجيل الدخول إلى لوحة التحكم
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#243746]">
              البريد الإلكتروني
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4">
              <Mail className="text-gray-400" size={20} />

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full py-3 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#243746]">
              كلمة المرور
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4">
              <LockKeyhole className="text-gray-400" size={20} />

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخلي كلمة المرور"
                className="w-full py-3 outline-none"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#16A6A1] py-3 font-bold text-white transition hover:bg-[#128d89] disabled:opacity-60"
          >
            {loading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-gray-400">
          Sairna Admin Dashboard
        </p>
      </div>
    </div>
  );
}
