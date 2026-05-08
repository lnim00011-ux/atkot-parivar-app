import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system/legacy";
import { isSupabaseConfigured, supabase } from "../config/supabase";

const RESULT_BUCKET = "student-results";

function getFileExtension(uri) {
  const match = uri.match(/\.([a-zA-Z0-9]+)(\?|$)/);
  return match?.[1]?.toLowerCase() || "jpg";
}

function getContentType(extension) {
  if (extension === "png") return "image/png";
  if (extension === "webp") return "image/webp";
  return "image/jpeg";
}

export async function uploadStudentResult({ imageUri, studentName, standard, memberId }) {
  if (!isSupabaseConfigured) throw new Error("Supabase is not configured. Add your Supabase URL and anon key first.");

  const extension = getFileExtension(imageUri);
  const contentType = getContentType(extension);
  const safeName = studentName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const filePath = `${memberId || "anonymous"}/${Date.now()}-${safeName}.${extension}`;
  const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 });

  const { data: storageData, error: storageError } = await supabase.storage
    .from(RESULT_BUCKET)
    .upload(filePath, decode(base64), { contentType, cacheControl: "3600", upsert: false });

  if (storageError) throw storageError;

  const { data: publicUrlData } = supabase.storage.from(RESULT_BUCKET).getPublicUrl(filePath);
  const { error: insertError } = await supabase.from("student_results").insert({
    student_name: studentName.trim(),
    standard: standard.trim(),
    member_id: memberId,
    image_path: storageData.path,
    image_url: publicUrlData.publicUrl,
    status: "pending_review"
  });

  if (insertError) throw insertError;
  return { path: storageData.path, publicUrl: publicUrlData.publicUrl };
}
