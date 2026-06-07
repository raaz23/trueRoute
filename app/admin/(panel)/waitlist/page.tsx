import AdminCrud from "@/components/admin/AdminCrud";

const fields = [
  { key: "email", label: "Email" },
  { key: "country", label: "Country" },
];

export default function AdminWaitlistPage() {
  return <AdminCrud model="waitlist" title="Waitlist Emails" fields={fields} readOnly />;
}
