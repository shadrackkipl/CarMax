import { Navigate, Route, Routes } from "react-router-dom";
import StaffRoute from "../components/staff/Staffroute";
import StaffLogin from "../components/staff/Stafflogin";
import StaffCars from "../components/staff/Staffcars";
import StaffCarForm from "../components/staff/Staffcarform";
import StaffSales from "../components/staff/StaffSales";
import StaffInvoice from "../components/staff/StaffInvoice";

/**
 * Main page of the staff panel. App.jsx mounts it at /staff/*, so the paths
 * below are relative to /staff.
 */
const Staff = () => {
  return (
    <Routes>
      <Route path="login" element={<StaffLogin />} />

      {/* Everything below needs a signed-in staff member */}
      <Route element={<StaffRoute />}>
        <Route index element={<Navigate to="cars" replace />} />
        <Route path="cars" element={<StaffCars />} />
        <Route path="cars/new" element={<StaffCarForm />} />
        <Route path="cars/:id/edit" element={<StaffCarForm />} />
        <Route path="sales" element={<StaffSales />} />
        <Route path="sales/:id/invoice" element={<StaffInvoice />} />
      </Route>

      <Route path="*" element={<Navigate to="/staff" replace />} />
    </Routes>
  );
};

export default Staff;