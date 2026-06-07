import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseServiceConfigured } from "@/lib/supabase/config";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_DOC_BYTES = 10 * 1024 * 1024;

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const DOC_TYPES = new Set([...IMAGE_TYPES, "application/pdf"]);

export type UploadKind = "media" | "document";

export async function uploadBusinessFile(
  file: File,
  businessId: string,
  kind: UploadKind
): Promise<{ url: string; storage: "supabase" | "local" }> {
  const maxBytes = kind === "document" ? MAX_DOC_BYTES : MAX_IMAGE_BYTES;
  const allowed = kind === "document" ? DOC_TYPES : IMAGE_TYPES;

  if (file.size > maxBytes) {
    throw new Error(`File too large (max ${maxBytes / 1024 / 1024}MB)`);
  }
  if (!allowed.has(file.type)) {
    throw new Error(`File type not allowed: ${file.type}`);
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (isSupabaseServiceConfigured()) {
    const supabase = createAdminClient()!;
    const bucket = kind === "document" ? "business-documents" : "business-media";
    const objectPath = `${businessId}/${safeName}`;

    const { error } = await supabase.storage.from(bucket).upload(objectPath, buffer, {
      contentType: file.type,
      upsert: false,
    });
    if (error) throw new Error(`Supabase upload failed: ${error.message}`);

    if (kind === "media") {
      const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
      return { url: data.publicUrl, storage: "supabase" };
    }

    const { data: signed, error: signErr } = await supabase.storage
      .from(bucket)
      .createSignedUrl(objectPath, 60 * 60 * 24 * 365);
    if (signErr || !signed?.signedUrl) {
      throw new Error(signErr?.message ?? "Could not create signed URL");
    }
    return { url: signed.signedUrl, storage: "supabase" };
  }

  const dir = path.join(process.cwd(), "public", "uploads", "business", businessId);
  await mkdir(dir, { recursive: true });
  const filePath = path.join(dir, safeName);
  await writeFile(filePath, buffer);
  return {
    url: `/uploads/business/${businessId}/${safeName}`,
    storage: "local",
  };
}
