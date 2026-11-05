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
to create the table and enable read-only access to published projects.
Then run
[`supabase/migrations/20261105120000_split_project_links.sql`](./supabase/migrations/20261105120000_split_project_links.sql)
to rename the existing `url` column to `live_url` (preserving saved links) and
add the optional `github_url` column.
Run
[`supabase/migrations/20261105130000_create_project_images_bucket.sql`](./supabase/migrations/20261105130000_create_project_images_bucket.sql)
to create the public `project-images` Storage bucket used for images uploaded
from the admin page. The admin upload accepts PNG, JPG, and WebP files up to
5 MB; public access is read-only, and uploads use the server-only service role.

Copy the project URL and publishable key from **Project Settings → API** into
`my-portfolio/.env.local` as `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. These are public client credentials;
the table's row-level security policy limits reads to published rows. Never
put a service-role/secret key in a `NEXT_PUBLIC_` variable.

Add project entries in the table with `title`, `slug`, `description`, and
optional `live_url`, `github_url`, and `image_url`; the admin page also lets you
upload a PNG, JPG, or WebP image instead of entering an image URL. Set
`published` to `true` to display projects. `sort_order` controls their order
(lower values appear first). Restart the dev server after changing environment
variables.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
