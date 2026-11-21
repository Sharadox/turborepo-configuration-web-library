# Changelog

What changed in each version of `@sharadox/turborepo-configuration-web-library`, newest first.

## 0.1.3

A Next.js application's build waits for its type check: `next typegen` writes into .next while `next build` clears it, so running both at once lost the route types now and then.

## 0.1.2

End-to-end tests receive PORT, so several CI runners on one machine each use their own port.
