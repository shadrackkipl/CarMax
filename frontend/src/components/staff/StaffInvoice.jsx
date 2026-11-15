import AdminInvoice from "../admin/AdminInvoice";
import { staffApi } from "./Staffapi";

// The staff member's view of an invoice they closed: same printable invoice
// as the admin's, but without the edit button.
const StaffInvoice = () => (
  <AdminInvoice api={staffApi} backPath="/staff/sales" canEdit={false} />
);

export default StaffInvoice;