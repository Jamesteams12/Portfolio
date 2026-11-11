"use server";

import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import { headers } from "next/headers";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

function getContactField(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function getClientIp(requestHeaders: Headers) {
  const forwardedIps = requestHeaders.get("x-forwarded-for")?.split(",") ?? [];
  const candidates = [
    requestHeaders.get("x-real-ip"),
    ...forwardedIps,
  ];

  return candidates
    .map((ip) => ip?.trim())
    .find((ip): ip is string => Boolean(ip && isIP(ip)));
}

export async function submitContact(formData: FormData) {
  const website = getContactField(formData, "contact_website");
  if (website) {
    console.warn("Discarded contact submission because the honeypot was filled.");
    redirect("/contact?error=submit-failed");
  }

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

  let rateLimited = false;
  let submissionError: unknown;
  try {
    const supabase = getSupabaseAdminClient();
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
      throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
    }

    const clientIp = getClientIp(await headers());
    if (!clientIp) {
      throw new Error("Unable to determine client IP for contact rate limiting.");
    }

    const ipHash = createHmac("sha256", serviceRoleKey)
      .update(clientIp)
      .digest("hex");
    const { data: allowed, error: rateLimitError } = await supabase.rpc(
      "consume_contact_submission",
      { p_ip_hash: ipHash },
    );

    if (rateLimitError) {
      throw rateLimitError;
    }
    if (typeof allowed !== "boolean") {
      throw new Error("Contact rate-limit function returned an invalid result.");
    }
    if (!allowed) {
      rateLimited = true;
    } else {
      const { error } = await supabase
        .from("contacts")
        .insert({ name, email, message });
      submissionError = error;
    }
  } catch (error) {
    submissionError = error;
  }

  if (rateLimited) {
    redirect("/contact?error=rate-limited");
  }

  if (submissionError) {
    console.error("Unable to save contact submission:", submissionError);
    redirect("/contact?error=submit-failed");
  }

  redirect("/contact?success=1");
}
