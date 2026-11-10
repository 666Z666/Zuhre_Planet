---
name: adult-marketplace-safety-engineering
description: Safety-first engineering and release review for adult-oriented classifieds, directories, and marketplaces. Use when auditing or changing age/consent gates, public listing eligibility, identity or media moderation, contact privacy, abuse reporting, payments/intermediation boundaries, SEO, or release readiness; includes a Zühre Planet project profile and a reusable documentation-command checker.
---

# Adult Marketplace Safety Engineering

Use for adult-oriented classified directories and comparable high-risk user-generated-content products. Treat legal, safety, and privacy assumptions as release constraints, not as implementation details.

## Workflow

1. **Discover current state.** Read repository instructions, package scripts, environment example, project map, release notes, relevant code/tests. Prefer active code and dated audit evidence over stale TODOs. Do not assume an archive and checkout are identical.
2. **Define the product boundary.** Separate listing/discovery from arranging meetings, bookings, transport, accommodation, payment handling, or other intermediary services. Do not restore a feature explicitly excluded for safety or legal-risk reasons. Refer jurisdiction-specific questions for qualified legal review; do not present engineering notes as legal advice.
3. **Centralize publication eligibility.** Define one server-side predicate for every policy state that the product actually requires and models: minimum age, visibility, moderation/consent/verification where applicable. Treat missing required state as fail-closed; do not invent a consent/verification field that the schema does not support—record it as a blocker. Reuse the predicate in public lists, profile-by-ID/slug, location counts, sitemaps, favorites/contact surfaces, and public statistics. Make rejection/takedown stop public reads immediately and test all state boundaries.
4. **Protect people and data.** Minimize identity/contact data in public responses and logs; encrypt sensitive contact details; rate-limit reveal/report/auth endpoints; retain moderation audit trails; never expose verification evidence. Provide human abuse reporting, takedown, appeals, and escalation. Do not automate high-impact identity or exploitation decisions without human review.
5. **Keep metrics truthful.** Use database-side filtering/counting/pagination. Never fabricate online counts, revenue, reviews, identity attributes, or structured-data facts. Distinguish unknown/unconfigured from zero; batch related-data queries instead of N+1 lookups.
6. **Keep UX and SEO honest.** A front-end age-consent prompt is not identity/age verification. Do not claim verification, ratings, prices, availability, or services without source data and permission. Keep indexing disabled until explicit legal/product approval and moderation readiness; keep sparse/unsafe pages non-indexable.
7. **Change in testable slices.** Add regression tests before or with fixes. Run typecheck, focused/full tests, build, lint where configured. Never migrate or write to production DB during an audit. Do not read `.env` or print secrets.
8. **Refresh the project map/backlog.** Record what changed, what was verified, evidence/commands and limits, what remains blocked, and dependencies/owners. Merge or retire stale TODO claims instead of duplicating them.
9. **Check documentation commands.** If available, run `node scripts/check-doc-commands.mjs`; fix nonexistent `npm run` references or label historical commands. This read-only checker does not replace executing the commands.

## Similarweb / competitor research

When traffic/competitor analysis is requested and a public domain is supplied, read and use the available `similarweb-analytics` skill rather than inventing an API integration. Save returned data with date range and domain. Summarize visits/trend, engagement, source mix, geography and limitations. Treat Similarweb figures as modeled estimates—not first-party analytics, revenue, compliance or individual behavior. Never call without a target domain or imply a report was run when none was.

## Zühre Planet reference

Read [`references/zuhre-planet-profile.md`](references/zuhre-planet-profile.md) only for Zühre Planet work, then revalidate the paths and claims against the current checkout.

## Bundled tools

- `scripts/check-doc-commands.mjs`: check `npm run <name>` references in selected Markdown against current `package.json` scripts; read-only, no third-party dependencies.
- `templates/release-readiness.md`: copy for a release handoff; label unverifiable facts and blocked decisions explicitly.
