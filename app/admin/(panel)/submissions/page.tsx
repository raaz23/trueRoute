import AdminCrud from "@/components/admin/AdminCrud";

const fields = [
  { key: "serviceName", label: "Service" },
  { key: "pricePaid", label: "Paid NPR", type: "number" as const },
  {
    key: "status",
    label: "Status",
    type: "select" as const,
    options: [
      { value: "PENDING", label: "Pending" },
      { value: "APPROVED", label: "Approved" },
      { value: "REJECTED", label: "Rejected" },
    ],
  },
  { key: "notes", label: "Notes", type: "textarea" as const },
];

export default function AdminSubmissionsPage() {
  return <AdminCrud model="submissions" title="Price Submissions" fields={fields} />;
}
