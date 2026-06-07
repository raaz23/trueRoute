import AdminCrud from "@/components/admin/AdminCrud";
import { phraseFields } from "@/lib/admin/fields";

export default function AdminPhrasesPage() {
  return <AdminCrud model="phrases" title="Translation Phrases" fields={phraseFields} />;
}
