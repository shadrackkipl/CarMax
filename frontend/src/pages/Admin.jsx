import { Navigate, Route, Routes } from "react-router-dom";
import StaffRoute from "../components/staff/Staffroute";
import AdminLayout from "../components/admin/Adminlayout";
import AdminDashboard from "../components/admin/Admindashboard";
import AdminStaff from "../components/admin/Adminstaff";
import AdminSalesReps from "../components/admin/Adminsalesreps";
import AdminInquiries from "../components/admin/AdminInquiries";
import AdminSales from "../components/admin/AdminSales";
import AdminInvoice from "../components/admin/AdminInvoice";
import AdminAnnouncements from "../components/admin/Adminannouncements";
import AdminSlides from "../components/admin/Adminslides";
import AdminBookings from "../components/admin/Adminbookings";

/**
 * Main page of the admin panel. App.jsx mounts it at /admin-panel/*, so the
 * paths below are relative to /admin-panel. Only the administrator gets in;
 * signed-out visitors go to the login page and staff go to their own panel.
 */
const Admin = () => {
  return (
    <Routes>
      <Route element={<StaffRoute requireSuperuser />}>
        {/* The invoice is a full page so it prints cleanly */}
        <Route path="sales/:id/invoice" element={<AdminInvoice />} />

        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="inquiries" element={<AdminInquiries />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="sales" element={<AdminSales />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="slides" element={<AdminSlides />} />
          <Route path="staff" element={<AdminStaff />} />
          <Route path="sales-reps" element={<AdminSalesReps />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/admin-panel" replace />} />
    </Routes>
  );
};

export default Admin;