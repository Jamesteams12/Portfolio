"use server";

import { getSupabaseClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

function getContactField(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitContact(formData: FormData) {
  const name = getContactField(formData, "name");
  const email = getContactField(formData, "email");
  const message = getContactField(formData, "message");

  if (
    !name ||
    name.length > 200 ||
    !email ||
    email.length > 320 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !message ||
    message.length > 10000
  ) {
    redirect("/contact?error=invalid");
  }

  let submissionError: unknown;
  try {
    const { error } = await getSupabaseClient()
      .from("contacts")
      .insert({ name, email, message });
    submissionError = error;
  } catch (error) {
    submissionError = error;
  }

  if (submissionError) {
    console.error("Unable to save contact submission:", submissionError);
    redirect("/contact?error=submit-failed");
  }

  redirect("/contact?success=1");
}
