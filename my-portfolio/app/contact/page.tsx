import { submitContact } from "./actions";

type ContactPageProps = {
  searchParams: Promise<{ error?: string | string[]; success?: string | string[] }>;
};

export const instant = false;

export default async function Page({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const error = Array.isArray(params.error) ? params.error[0] : params.error;
  const success = Array.isArray(params.success)
    ? params.success[0]
    : params.success;

  return (
    <section className="mx-auto w-full max-w-xl px-6 py-16">
      <h1 className="mb-3 text-3xl font-bold text-white">Contact</h1>
      <p className="mb-8 text-white">
        Send me a message using the form below.
      </p>

      {success === "1" && (
        <p className="mb-6 rounded bg-green-100 px-4 py-3 text-green-900" role="status">
          Thanks for reaching out. Your message has been sent.
        </p>
      )}
      {error === "invalid" && (
        <p className="mb-6 rounded bg-red-100 px-4 py-3 text-red-900" role="alert">
          Please enter a valid name, email address, and message.
        </p>
      )}
      {error === "submit-failed" && (
        <p className="mb-6 rounded bg-red-100 px-4 py-3 text-red-900" role="alert">
          We couldn&apos;t send your message. Please try again.
        </p>
      )}

      <form action={submitContact} className="flex flex-col gap-5">
        <div aria-hidden="true" className="absolute left-[-9999px]">
          <label>
            Leave this field empty
            <input autoComplete="off" name="website" tabIndex={-1} />
          </label>
        </div>
        <label className="flex flex-col gap-2 font-medium text-white">
          Name
          <input
            autoComplete="name"
            className="rounded border border-gray-300 bg-white px-3 py-2 text-gray-950"
            maxLength={200}
            name="name"
            required
          />
        </label>
        <label className="flex flex-col gap-2 font-medium text-white">
          Email
          <input
            autoComplete="email"
            className="rounded border border-gray-300 bg-white px-3 py-2 text-gray-950"
            maxLength={320}
            name="email"
            required
            type="email"
          />
        </label>
        <label className="flex flex-col gap-2 font-medium text-white">
          Message
          <textarea
            className="min-h-36 resize-y rounded border border-gray-300 bg-white px-3 py-2 text-gray-950"
            maxLength={10000}
            name="message"
            required
            rows={6}
          />
        </label>
        <button
          className="w-fit rounded bg-gray-900 px-5 py-2.5 font-semibold text-white hover:bg-gray-700"
          type="submit"
        >
          Submit
        </button>
      </form>
    </section>
  );
}
