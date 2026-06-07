import AdminCrud from "@/components/admin/AdminCrud";
import { faqFields } from "@/lib/admin/fields";

export default function AdminFaqPage() {
  return <AdminCrud model="faq" title="FAQ" fields={faqFields} />;
}
