import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "./components/layout/DashboardLayout.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";

import Login from "./pages/Login.jsx";
import DashboardHome from "./pages/DashboardHome.jsx";
import Trips from "./pages/Trips.jsx";
import Companies from "./pages/Companies.jsx";
import Bookings from "./pages/Bookings.jsx";
import Users from "./pages/Users.jsx";
import Cities from "./pages/Cities.jsx";
import Settings from "./pages/Settings.jsx";
function SimplePage({ title }) {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-[#0D3043]">{title}</h1>

      <p className="mt-3 text-gray-500">
        سيتم تطوير هذه الصفحة وربطها بالباك إند لاحقًا.
      </p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* صفحة تسجيل الدخول */}
        <Route path="/login" element={<Login />} />

        {/* الصفحات المحمية */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Routes>
                  <Route path="/" element={<DashboardHome />} />
                  <Route path="/trips" element={<Trips />} />
                  <Route path="/bookings" element={<Bookings />} />
                  <Route path="/companies" element={<Companies />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/cities" element={<Cities />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route
                    path="*"
                    element={<SimplePage title="الصفحة غير موجودة" />}
                  />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
