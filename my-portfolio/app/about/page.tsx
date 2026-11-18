import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | TJ Fraser Portfolio",
  description:
    "Learn about TJ Fraser's journey as an aspiring software developer and review his experience, interests, and CV.",
  openGraph: {
    title: "About | TJ Fraser Portfolio",
    description:
      "Learn about TJ Fraser's journey as an aspiring software developer and review his experience, interests, and CV.",
  },
};

export default function Page() {
  return (
    <section className="mx-auto w-full max-w-xl px-6 py-16">
      <h1 className="mb-6 text-3xl font-bold text-white">About</h1>
      <a
        className="inline-block w-fit rounded bg-gray-900 px-5 py-2.5 font-semibold text-white hover:bg-gray-700"
        download="TJ-Fraser-CV.pdf"
        href="/cv/TJ-Fraser-CV.pdf"
      >
        Download CV
      </a>
    </section>
  );
}
