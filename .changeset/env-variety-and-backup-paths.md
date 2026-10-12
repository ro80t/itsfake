---
"itsfake": minor
---

Vary the fake `.env` content across Laravel/Node/Django flavors on each request, and widen the `.env` trap to also catch backup-style variants (`.env~`, `.env_old`, `.env-bak`) and nested paths (`/config/.env`).
