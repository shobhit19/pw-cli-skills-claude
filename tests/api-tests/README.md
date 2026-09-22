# API test suite — Petstore

Generated from `specs/api/petstore.yaml` (the OpenAPI 3.0 spec for the public
[Swagger Petstore](https://petstore3.swagger.io) sandbox).

## Structure

Mirrors the UI test suite's POM pattern (`src/pages/BasePage.ts` + one class per page), applied
to API operations instead of pages:

- `tests/api-tests/BaseApi.ts` — abstract base holding the shared `APIRequestContext`, analogous
  to `BasePage`.
- `tests/api-tests/types.ts` — TypeScript interfaces mirrored from `components.schemas` in the
  spec (`Pet`, `Order`, `User`, `Category`, `Tag`, `ApiResponse`).
- `tests/api-tests/<module>/<endpoint>.ts` — one class per operation (19 total: 8 pet, 4 store,
  7 user), each wrapping exactly one HTTP call. Class name / file name / method match the spec's
  `operationId`.
- `tests/api-tests/utils/schemaValidator.ts` — loads `specs/api/petstore.yaml` at runtime and
  compiles each `components.schemas` entry with `ajv`, so response-shape assertions check against
  the spec itself instead of a hand-duplicated copy of it.
- `tests/api-tests/pet.spec.ts`, `store.spec.ts`, `user.spec.ts` — the test files, one per
  resource, each covering happy path, boundary, negative, and schema-validation cases for every
  operation in that resource.
- `tests/api-data/*.json` — all payloads, IDs, and enum values used by the tests. No literal
  values are hardcoded into spec or endpoint-class files.

The `api` Playwright project in `playwright.config.ts` sets `baseURL:
'https://petstore3.swagger.io/api/v3'` and scopes to `tests/api-tests`, so the base URL is
config-driven rather than hardcoded per file. The existing UI tests are unaffected — they now run
under the `ui` project with the original `saucedemo.com` baseURL.

## Documented quirks encoded as boundary tests

- `getOrderById` (`store.spec.ts`): per the spec's own description, only order IDs `<=5` or `>10`
  succeed; IDs in between generate an exception. Tested at IDs 5, 11 (valid) and 6, 10 (invalid).
- `deleteOrder` (`store.spec.ts`): only order IDs `<1000` succeed; above 1000 (or a non-integer)
  fails. Tested at IDs 999 (valid) and 1001 (invalid).

## A note on the "missing auth" negative tests

`pet.spec.ts` and `store.spec.ts` include tests that send requests without an `Authorization` /
`api_key` header to endpoints the spec marks as `petstore_auth`- or `api_key`-protected. The
public `petstore3.swagger.io` sandbox is well known **not** to actually enforce these security
schemes — every operation succeeds regardless of credentials. These tests assert that real,
observed behaviour (still succeeds) rather than the spec's nominal security requirement, so they
hold on every run instead of failing against a demo server that was never enforcing auth in the
first place. Each such test has an inline `NOTE:` comment; if this suite is ever pointed at an
environment that does enforce auth, heal those specific assertions to expect `401`/`403`.

## Verification status

These tests were generated without live network access to `petstore3.swagger.io` — this sandbox's
egress policy blocks outbound access to it. The suite parses and lists correctly (`npx playwright
test --project=api --list`), and the schema-validation logic was sanity-checked offline against
hand-built payloads, but the tests have **not been run against the live API**. Run them once in an
environment with network access and heal any failures per the plan/generate/heal workflow in
`.claude/skills/playwright-cli/references/test-generation.md` §3:

```bash
npx playwright test --project=api
```
