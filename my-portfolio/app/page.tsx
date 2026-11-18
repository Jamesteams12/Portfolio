import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "TJ Fraser | Aspiring Software Developer",
  description:
    "Explore TJ Fraser's software development portfolio, projects, and experience.",
};

export default function Home() {
  redirect("/about");
}
