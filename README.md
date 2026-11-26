# TJ Fraser | Developer Portfolio

A personal portfolio site built to show employers what I can do with React, Next.js, Tailwind and Supabase, and the kind of junior software developer role I'm looking for.

## Features

- Responsive About, Projects, Skills, and Contact pages
- Project and skill listings stored in Supabase
- Contact form with server-side validation and spam/rate-limit protections
- Password-protected admin dashboard for managing projects and skills
- Downloadable CV
- GitHub and LinkedIn profile links
- SEO metadata, sitemap, and robots.txt

## Technologies

- Next.js and React
- TypeScript
- Tailwind CSS
- Supabase
- NextAuth.js
- Vercel

## Live Site

[my-portfolio-olive-three-76.vercel.app](https://my-portfolio-olive-three-76.vercel.app)


## Walkthrough

[Watch the portfolio walkthrough on YouTube](https://www.youtube.com/watch?v=MCbuMbYMQ8I)

## Installation and Setup

Requirements: Node.js, npm, and a Supabase project.

```powershell
git clone https://github.com/Jamesteams12/Portfolio.git
Set-Location Portfolio\my-portfolio
Copy-Item .env.example .env.local
npm install
npm run dev
```

Before starting the app, add the required values to `my-portfolio/.env.local` using the variable names below. Do not commit this file.

For a new Supabase database, run [`supabase/setup.sql`](my-portfolio/supabase/setup.sql) once in the Supabase SQL editor. For an existing database, apply its pending timestamped files from [`supabase/migrations`](my-portfolio/supabase/migrations) instead; do not run the fresh-database setup script against tables that already exist.

The development server is available at `http://localhost:3000`.

## Environment Variables

Set these names in `my-portfolio/.env.local`; do not put secret values in this README:

- `ADMIN_PASSWORD`
- `AUTH_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## AI Usage

I used AI tools (Claude and Copilot from VS-code) to: Plan how the website might or could look like, Brainstorm ideas when I don't have any idea how to effectively present a page or website and Explain error problems and how to fit it. I understand the code in this repo and can explain any part of it and how it works. Where AI helped in writing the code, I reviewed it to make sure it works as intended and changed the result myself into the style I want.

## Skills and Credentials

My verified badges are available on [Credly](https://www.credly.com/users/tj-fraser.fa11c5cf/badges/credly).
