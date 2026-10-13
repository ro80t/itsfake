---
"itsfake": patch
---

Drop literal `https://` strings from the fake `.git/config` (now an SSH-style remote) and `wp-login.php` (dropped the wordpress.org link) output, to avoid tripping URL-fragment scanners on inert fake data.
