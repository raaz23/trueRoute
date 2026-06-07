import AdminCrud from "@/components/admin/AdminCrud";
import { priceFields } from "@/lib/admin/fields";

export default function AdminPricesPage() {
  return <AdminCrud model="prices" title="Fair Prices" fields={priceFields} />;
}
