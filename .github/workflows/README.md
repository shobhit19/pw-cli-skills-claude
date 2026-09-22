# CI/CD Pipeline — PR Test Pipeline

A basic GitHub Actions pipeline for this POC. It runs automatically on every pull request and
gates merging on `build` passing AND **at least one** of `ui-tests` / `api-tests` passing.

## What it does

**Trigger:** runs whenever a pull request is opened or updated against `master`.

**Stages** (each stage is a separate GitHub Actions "job"):

| Stage | What it does | Command |
|---|---|---|
| **build** | Installs dependencies and type-checks the whole TypeScript codebase (no output files — just catches type errors) | `npm run build` (→ `tsc --noEmit`) |
| **ui-tests** | Installs the Chromium browser and runs the UI test suite against Saucedemo | `npm run test:ui` (→ `playwright test --project=ui`) |
| **api-tests** | Runs the API test suite against the live Petstore sandbox (no browser needed) | `npm run test:api` (→ `playwright test --project=api --workers=1`) |
| **tests-gate** | Passes if `ui-tests` **or** `api-tests` succeeded; fails only if both failed | inline shell check against `needs.*.result` |

`ui-tests` and `api-tests` both **depend on `build`** (`needs: build`) — if the code doesn't
compile, neither test stage runs. `ui-tests` and `api-tests` run in parallel with each other once
`build` succeeds. `tests-gate` runs after both (`needs: [ui-tests, api-tests]`, `if: always()` so
it still runs even if one or both failed) and is the actual merge gate for the test stages — see
**Why an OR gate** below.

If a test stage fails, its Playwright HTML report is uploaded as a downloadable artifact on the
workflow run page (`ui-test-report` / `api-test-report`), so you don't need to reproduce the
failure locally just to see what broke.

## Why an OR gate

`api-tests` runs against `petstore3.swagger.io`, a shared public demo server — not a backend this
project controls. It can be genuinely down or erroring for reasons that have nothing to do with
the code in a given PR. Requiring both suites to pass (AND) would let an unrelated outage on that
public sandbox block every PR indefinitely. Requiring `ui-tests` OR `api-tests` (`tests-gate`)
means a PR can still merge on a solid UI test pass even if the public API sandbox is having a bad
day, while `build` and at least one full test suite passing are still non-negotiable — this is
strictly for the POC's dependency on an external demo server the team doesn't own, not a general
excuse to ignore a suite's failures. Once a dedicated/mocked API test target exists, switch back to
requiring both suites individually.

## File

The pipeline is defined in [`ci.yml`](./ci.yml) in this same folder. GitHub automatically picks up
any `.yml` file under `.github/workflows/` — no extra registration needed.

## Requiring it before merge

The workflow running is not, by itself, enough to *block* a merge — that also needs a **branch
protection rule** on `master`, which is a repository setting (not something in this YAML file).
One-time setup, done by a repo admin:

1. Go to the repo on GitHub → **Settings** → **Branches**.
2. Under **Branch protection rules**, click **Add rule** (or edit the existing rule for `master`).
3. Set **Branch name pattern** to `master`.
4. Enable **Require status checks to pass before merging**.
5. Search for and select **two** checks: **Build (compile)** and **Tests Gate (UI or API)**.
   Do **not** also select "UI Tests" / "API Tests" individually — those are allowed to show red
   without blocking the merge, as long as `Tests Gate` is green (see **Why an OR gate** above).
   (Checks only appear in this list after the workflow has run at least once — open the PR first
   so GitHub Actions picks up the workflow, then come back to this step.)
6. Save the rule.

After that, GitHub will show all four checks on every PR (`Build`, `UI Tests`, `API Tests`,
`Tests Gate`), but only `Build` and `Tests Gate` block the merge button.

## Running the same checks locally

Before pushing, you can run exactly what CI runs:

```bash
npm ci                          # clean install, matches CI
npm run build                   # same as the build stage
npx playwright install chromium # only needed once, for UI tests
npm run test:ui                 # same as the ui-tests stage
npm run test:api                # same as the api-tests stage
```

## Extending this pipeline later

This is intentionally minimal for the POC. Natural next steps, when needed:

- Add a `lint` stage (e.g. ESLint) before `build`.
- Run against multiple Node versions using a `strategy.matrix`.
- Add a trigger on `push` to `master` as well as `pull_request`, to catch issues after merge too.
- Add Slack/Teams notification on failure.
- Cache Playwright browser binaries (`~/.cache/ms-playwright`) to speed up `ui-tests`.
