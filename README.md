# TJ Fraser | Developer Portfolio
 
A personal portfolio site built to show employers what I can do with React, Next.js, Tailwind and Supabase, and the kind of junior software developer role I'm looking for.

## Live URL (Vercel)

Link: [my-portfolio-olive-three-76.vercel.app](https://my-portfolio-olive-three-76.vercel.app/about)

## About this project
 
This site is my portfolio and also my capstone: a working full-stack app. It will show who I am, what I've built, and the evidence behind my skills. Everything (design, words and code) is my own.

## Planned pages
 
- **About:** who I am and the role I want

- **Projects:** capstone as a full case study (problem, my role, stack, screenshots, live and repo links, what's next)

- **Skills:** each skill linked to evidence (projects, repos, certifications)

- **Contact:** working form saved to Supabase, with spam protection

- **CV:** downloadable PDF

- **Admin** (private): manage project entries through the authenticated admin page and Supabase

## Environment Variables

ADMIN_PASSWORD=
AUTH_SECRET=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=

## Skills and credentials
 
My verified badges are on [Credly](https://www.credly.com/users/tj-fraser.fa11c5cf/badges/credly). So I will link each skill to this to show evidence.

## AI Usaged
 
I used AI tools (Claude mainly) to: Plan how the website might or could look like, Brainstorm ideas when I don't have any idea how to effectively present a page or website and Explain error problems and how to fit it. I wrote and understand the code in this repo and can explain any part of it. Where AI helped, I reviewed and changed the result myself.

## Peer review

What the reviewer said: "The wireframes show a good structure, but the Projects page could benefit from project cards that display screenshots, technologies used, and links to GitHub repositories."

Reflection from the review: The feedback highlighted the importance of showcasing projects in a more visual way. I will plan to change the method for Project page to a project cards method containing screenshots, technology stacks, and repository links to make my work easier to evaluate.

## 9. Reflection for Submission (Week 33)

The `projects` table uses a UUID primary key and stores each project's title, description, unique slug, optional links and image, publication status, sort order, and creation time. Admin authentication uses a password stored in `ADMIN_PASSWORD`, with NextAuth maintaining a JWT session signed using `AUTH_SECRET`. Row-level security is enabled, and its select policy lets visitors read only rows where `published` is true; admin reads and changes are handled server-side after authentication. I tested visitor restrictions by checking that a logged-out visitor is redirected from `/admin` to `/login` and that the public Projects page queries only published rows.
