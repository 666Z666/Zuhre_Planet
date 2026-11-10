# Project Map

This file is a pointer to the maintained source of truth. Detailed architecture, current routes/components, security boundaries, quality changes, and open release gates are maintained in [PROJE_HARITASI.md](./PROJE_HARITASI.md) (Turkish). Setup commands belong to the root [README](../README.md); prioritized work and acceptance criteria belong to [ROADMAP.md](./ROADMAP.md).

## Repository landmarks

- `src/pages/`, `src/components/`, `src/hooks/`, `src/services/`: React/Vite client.
- `server/`, `server/routers/`, `server/lib/`: Express/tRPC API and server-side policy.
- `src/drizzle/schema.ts`, `drizzle/`, `scripts/`: database model, migrations, maintenance.
- `src/tests/`, `server/__tests__/`, `tests/e2e/`: automated test suites.
- `docs/`, `AGENTS.md`, `.agent/skills/`: project documentation, agent instructions, reusable domain safety skill.

The app is **not verified production-ready**. A client-side age self-attestation is not identity/age verification. Keep indexing disabled pending independent legal, age-assurance, data-protection, moderation, and operational review. Do not infer a product capability from a dependency or UI mock.
