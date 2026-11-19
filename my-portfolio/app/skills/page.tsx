import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skills | TJ Fraser Portfolio",
  description:
    "Explore TJ Fraser's programming languages, frameworks, development tools, and technical skills.",
  openGraph: {
    title: "Skills | TJ Fraser Portfolio",
    description:
      "Explore TJ Fraser's programming languages, frameworks, development tools, and technical skills.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TJ Fraser Portfolio",
      },
    ],
  },
};

export default function Page() {
  return <h1>Hello from the Skills page!</h1>
}