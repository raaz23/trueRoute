import AdminCrud from "@/components/admin/AdminCrud";

const fields = [
  { key: "authorName", label: "Name" },
  { key: "appRating", label: "Rating", type: "number" as const },
  { key: "text", label: "Text", type: "textarea" as const },
  { key: "approved", label: "Show on site", type: "boolean" as const },
  { key: "featured", label: "Featured", type: "boolean" as const },
];

export default function AdminFeedbackPage() {
  return <AdminCrud model="feedback" title="Visitor Feedback" fields={fields} />;
}
