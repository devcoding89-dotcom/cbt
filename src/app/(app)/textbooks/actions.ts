"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { repo } from "@/lib/db";

export async function toggleBookmarkAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;
  const id = String(formData.get("textbook_id") ?? "");
  if (!id) return;
  await repo.toggleBookmark(user.id, id);
  revalidatePath("/textbooks");
  revalidatePath(`/textbooks/${id}`);
}
