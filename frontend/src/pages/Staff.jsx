import { Navigate, Route, Routes } from "react-router-dom";
import StaffRoute from "../components/staff/Staffroute";
import StaffLogin from "../components/staff/Stafflogin";
import StaffCars from "../components/staff/Staffcars";
import StaffCarForm from "../components/staff/Staffcarform";


const Staff = () => {
  return (
    <Routes>
      <Route path="login" element={<StaffLogin />} />

   
      <Route element={<StaffRoute />}>
        <Route index element={<Navigate to="cars" replace />} />
        <Route path="cars" element={<StaffCars />} />
        <Route path="cars/new" element={<StaffCarForm />} />
        <Route path="cars/:id/edit" element={<StaffCarForm />} />
      </Route>

      <Route path="*" element={<Navigate to="/staff" replace />} />
    </Routes>
  );
};

export default Staff;