import { authenticate } from "./actions";

type LoginPageProps = {
  searchParams: Promise<{ error?: string | string[] }>;
};

export const instant = false;

export default async function Page({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const error = Array.isArray(params.error) ? params.error[0] : params.error;

  return (
    <section className="mx-auto w-full max-w-md px-6 py-16">
      <h1 className="mb-6 text-3xl font-bold">Admin login</h1>
      {error && (
        <p className="mb-4 text-red-600" role="alert">
          {error === "CredentialsSignin"
            ? "Incorrect password. Please try again."
            : "Unable to sign in. Please try again."}
        </p>
      )}
      <form action={authenticate} className="flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          Password
          <input
            autoComplete="current-password"
            className="rounded border border-gray-400 px-3 py-2 text-black bg-neutral-100"
            name="password"
            required
            type="password"
          />
        </label>
        <button
          className="rounded bg-gray-900 px-4 py-2 font-semibold text-white hover:bg-gray-700"
          type="submit"
        >
          Log in
        </button>
      </form>
    </section>
  );
}