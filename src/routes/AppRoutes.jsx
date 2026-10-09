import { Routes, Route } from 'react-router-dom'

import Home from '../pages/Home.jsx'
import BranchDetail from '../pages/BranchDetail.jsx'
import Hotels from '../pages/Hotels.jsx'
import HotelDetail from '../pages/HotelDetail.jsx'
import NotFound from '../pages/NotFound.jsx'

import AdminLogin from '../pages/admin/AdminLogin.jsx'
import AdminResetPassword from '../pages/admin/AdminResetPassword.jsx'
import AdminDashboard from '../pages/admin/AdminDashboard.jsx'
import ProtectedAdminRoute from '../components/admin/ProtectedAdminRoute.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public website */}
      <Route path="/" element={<Home />} />
      <Route
        path="/branches/:branchId"
        element={<BranchDetail />}
      />
      <Route
        path="/hotels"
        element={<Hotels />}
      />
      <Route
        path="/hotels/:hotelId"
        element={<HotelDetail />}
      />

      {/* Admin authentication */}
      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      <Route path="/admin/reset-password" element={<AdminResetPassword />} />

      {/* Protected admin routes */}
      <Route element={<ProtectedAdminRoute />}>
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
