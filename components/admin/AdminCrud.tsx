"use client";

import { useCallback, useEffect, useState } from "react";

type FieldDef = {
  key: string;
  label: string;
  type?: "text" | "number" | "textarea" | "boolean" | "select";
  options?: { value: string; label: string }[];
};

type Props = {
  model: string;
  title: string;
  fields: FieldDef[];
  readOnly?: boolean;
};

export default function AdminCrud({ model, title, fields, readOnly }: Props) {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/${model}`);
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [model]);

  useEffect(() => {
    load();
  }, [load]);

  const openNew = () => {
    const empty: Record<string, unknown> = {};
    fields.forEach((f) => {
      empty[f.key] = f.type === "boolean" ? true : "";
    });
    setForm(empty);
    setEditing({ id: "" });
  };

  const openEdit = (item: Record<string, unknown>) => {
    setEditing(item);
    const copy: Record<string, unknown> = {};
    fields.forEach((f) => {
      copy[f.key] = item[f.key] ?? "";
    });
    setForm(copy);
  };

  const save = async () => {
    const payload = { ...form };
    if (editing?.id) payload.id = editing.id;

    const method = editing?.id ? "PUT" : "POST";
    const res = await fetch(`/api/admin/${model}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setMsg("Saved!");
      setEditing(null);
      load();
      setTimeout(() => setMsg(""), 2000);
    } else {
      setMsg("Error saving");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/admin/${model}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  };

  const displayValue = (item: Record<string, unknown>, key: string) => {
    const v = item[key];
    if (typeof v === "boolean") return v ? "Yes" : "No";
    if (v && typeof v === "object" && "name" in (v as object)) {
      return String((v as { name: string }).name);
    }
    return String(v ?? "—").slice(0, 80);
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold">{title}</h1>
        {!readOnly && (
          <button
            type="button"
            onClick={openNew}
            className="rounded-xl bg-gradient-to-r from-[#D4A017] to-[#A87C10] px-5 py-2.5 text-[13px] font-semibold text-white"
          >
            + Add new
          </button>
        )}
      </div>
      {msg && <p className="mb-4 text-[13px] text-[var(--teal)]">{msg}</p>}

      {editing && !readOnly && (
        <div className="mb-8 rounded-2xl border border-[var(--gold)]/30 bg-[var(--bg-card)] p-6">
          <h2 className="mb-4 font-semibold">{editing.id ? "Edit" : "New"} {title}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {fields.map((f) => (
              <label key={f.key} className="block text-[12px]">
                <span className="font-medium text-[var(--text-mid)]">{f.label}</span>
                {f.type === "textarea" ? (
                  <textarea
                    value={String(form[f.key] ?? "")}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    rows={3}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[var(--bg)] px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-[var(--gold)]/30"
                  />
                ) : f.type === "boolean" ? (
                  <input
                    type="checkbox"
                    checked={Boolean(form[f.key])}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.checked })}
                    className="mt-2"
                  />
                ) : f.type === "select" && f.options ? (
                  <select
                    value={String(form[f.key] ?? "")}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[var(--bg)] px-3 py-2 text-[14px]"
                  >
                    <option value="">—</option>
                    {f.options.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={f.type === "number" ? "number" : "text"}
                    value={String(form[f.key] ?? "")}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[var(--bg)] px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-[var(--gold)]/30"
                  />
                )}
              </label>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={save}
              className="rounded-xl bg-[var(--teal)] px-5 py-2 text-[13px] font-semibold text-white"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-xl border border-white/15 px-5 py-2 text-[13px]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-[var(--text-muted)]">Loading…</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/8">
          <table className="w-full min-w-[600px] text-left text-[13px]">
            <thead className="bg-[var(--bg-card-2)] text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
              <tr>
                {fields.slice(0, 5).map((f) => (
                  <th key={f.key} className="px-4 py-3 font-semibold">
                    {f.label}
                  </th>
                ))}
                {!readOnly && <th className="px-4 py-3">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={String(item.id)} className="border-t border-white/6 hover:bg-white/[0.02]">
                  {fields.slice(0, 5).map((f) => (
                    <td key={f.key} className="max-w-[200px] truncate px-4 py-3">
                      {displayValue(item, f.key)}
                    </td>
                  ))}
                  {!readOnly && (
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="mr-2 text-[var(--gold)] hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(String(item.id))}
                        className="text-[var(--red)] hover:underline"
                      >
                        Del
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && (
            <p className="p-8 text-center text-[var(--text-muted)]">No items yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

