---
"itsfake": patch
---

Widen the `h3` peer dependency to `^1 || ^2` so `itsfake/nuxt` works on
Nuxt/Nitro setups that have upgraded to h3 v2, while still supporting v1.
