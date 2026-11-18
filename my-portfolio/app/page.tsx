import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "TJ Fraser | Aspiring Software Developer",
  description:
    "Discover TJ Fraser's software development work, featured projects, technical skills, and professional background.",
  openGraph: {
    title: "TJ Fraser | Aspiring Software Developer",
    description:
      "Discover TJ Fraser's software development work, featured projects, technical skills, and professional background.",
  },
};

export default function Home() {
  redirect("/about");
}
