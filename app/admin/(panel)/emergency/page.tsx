import AdminCrud from "@/components/admin/AdminCrud";
import { emergencyFields } from "@/lib/admin/fields";

export default function AdminEmergencyPage() {
  return <AdminCrud model="emergency" title="Emergency Numbers" fields={emergencyFields} />;
}
