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

- **Admin** (private): manage skills and project entries through the authenticated admin page and Supabase


## Environment Variables

- ADMIN_PASSWORD=
- AUTH_SECRET=
- NEXT_PUBLIC_SUPABASE_URL=
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
- SUPABASE_SERVICE_ROLE_KEY=

## Skills and credentials
 
My verified badges are on [Credly](https://www.credly.com/users/tj-fraser.fa11c5cf/badges/credly). So I will link each skill to this to show evidence.

## Setup (if you want to test it yourself)

For a new Supabase database, run [`my-portfolio/supabase/setup.sql`](my-portfolio/supabase/setup.sql) once to create the full schema.

Existing databases should continue using their pending timestamped migrations. Do not run the setup script on a database that already has these tables; it is a fresh-database bootstrap, while the migration files preserve deployment history.

## AI Usaged
 
I used AI tools (Claude and Copilot from VS-code) to: Plan how the website might or could look like, Brainstorm ideas when I don't have any idea how to effectively present a page or website and Explain error problems and how to fit it. I understand the code in this repo and can explain any part of it and how it works. Where AI helped in writing the code, I reviewed it to make sure it works as intended and changed the result myself into the style I want.

## Peer review

What the reviewer said: "The wireframes show a good structure, but the Projects page could benefit from project cards that display screenshots, technologies used, and links to GitHub repositories."

Reflection from the review: The feedback highlighted the importance of showcasing projects in a more visual way. I will plan to change the method for Project page to a project cards method containing screenshots, technology stacks, and repository links to make my work easier to evaluate.

## Reflection for Week 36

I improved the portfolio's discoverability by implementing SEO metadata, Open Graph sharing tags, a sitemap, and a robots.txt file. I optimized the site using Lighthouse and achieved scores above 90 for both SEO and accessibility. I also added links to my LinkedIn and GitHub profiles and tested all external links to ensure they function correctly.
