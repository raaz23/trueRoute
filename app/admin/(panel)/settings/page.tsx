import AdminCrud from "@/components/admin/AdminCrud";
import { settingFields } from "@/lib/admin/fields";

export default function AdminSettingsPage() {
  return (
    <AdminCrud
      model="settings"
      title="Site Text (hero, about, stats)"
      fields={settingFields}
    />
  );
}
