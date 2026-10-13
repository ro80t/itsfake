---
"itsfake": minor
---

Add a `raw` field to `TrapHit` passed to `onTrap`, exposing the underlying framework request object (the standard `Request` where a framework provides one — Hono, Elysia, Next.js, Astro, SvelteKit, TanStack Start — or the framework-native request/event otherwise — Express, Fastify, Nuxt/h3). `TrapHit` is now generic over this raw type.
