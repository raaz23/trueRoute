import AdminCrud from "@/components/admin/AdminCrud";
import { testimonialFields } from "@/lib/admin/fields";

export default function AdminTestimonialsPage() {
  return <AdminCrud model="testimonials" title="Testimonials" fields={testimonialFields} />;
}
