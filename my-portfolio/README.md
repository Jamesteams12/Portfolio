This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Admin login

Set `ADMIN_PASSWORD` to a strong password for the admin account and `AUTH_SECRET`
to a random secret in `my-portfolio/.env.local` before running the app. Both
variables are listed in `.env.example`; `.env.local` is ignored by Git and must
not be committed. Generate an `AUTH_SECRET` with `npx auth secret`. Visiting
`/admin` without a valid login redirects to `/login`.

## Supabase projects

The Projects page reads published entries from the Supabase `public.projects`
table. In the Supabase dashboard, open **SQL Editor** and run
[`supabase/migrations/20261026120000_create_projects.sql`](./supabase/migrations/20261026120000_create_projects.sql)
to create the table and enable read-only access to published projects. Then run
[`supabase/migrations/20261111090000_add_project_link_columns.sql`](./supabase/migrations/20261111090000_add_project_link_columns.sql)
to ensure the optional `url` and `image_url` columns exist, including on an
already-created table. Then run
[`supabase/migrations/20261111093000_add_project_github_and_live_urls.sql`](./supabase/migrations/20261111093000_add_project_github_and_live_urls.sql)
to add separate GitHub and live-demo links. Existing `url` values are copied
into the live-demo link.

Copy the project URL and publishable key from **Project Settings → API** into
`my-portfolio/.env.local` as `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. These are public client credentials;
the table's row-level security policy limits reads to published rows. Never
put a service-role/secret key in a `NEXT_PUBLIC_` variable.

Add project entries in the admin page with `title`, `slug`, `description`, and
optional GitHub URL, live URL, and image URL; set `published` to `true` to
display them. `sort_order` controls their order (lower values appear first).
Restart the dev server after changing environment variables.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

Contact form submissions can be stored in the Supabase `public.contacts` table.
Run
[`supabase/migrations/20261109100000_create_contacts.sql`](./supabase/migrations/20261109100000_create_contacts.sql)
and then
[`supabase/migrations/20261109183000_restrict_contacts_access.sql`](./supabase/migrations/20261109183000_restrict_contacts_access.sql)
and
[`supabase/migrations/20261111143500_harden_contact_submissions.sql`](./supabase/migrations/20261111143500_harden_contact_submissions.sql)
in the Supabase SQL Editor. The contact server action uses the server-only
service-role client after validating the form and rate limit; the public and
authenticated API roles cannot access the table directly. The rate limit allows
five submissions per IP per 15-minute window. IP addresses are HMACed before
being stored, and expired rate-limit rows are cleaned up automatically.

The app's admin login is NextAuth-based, not Supabase Auth. Any future contact
reader must verify the admin session before using the service-role client; that
key bypasses RLS and must never be exposed to the browser or a `NEXT_PUBLIC_`
variable. Configure the deployment proxy to set trustworthy `x-real-ip` or
`x-forwarded-for` headers so rate limits cannot be bypassed by spoofing the IP.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
