"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";

export async function authenticate(formData: FormData) {
  const password = formData.get("password");

  if (typeof password !== "string" || !password) {
    redirect("/login?error=CredentialsSignin");
  }

  try {
    await signIn("credentials", { password, redirectTo: "/admin" });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?error=CredentialsSignin");
    }

    throw error;
  }
}
