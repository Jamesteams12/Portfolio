import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { connection } from "next/server";

export const instant = false;

export default async function Page() {
  await connection();
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return <h1>Hello from the Admin page!</h1>;
}