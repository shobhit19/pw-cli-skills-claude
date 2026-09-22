# CI/CD Pipeline — PR Test Pipeline

A basic GitHub Actions pipeline for this POC. It runs automatically on every pull request and
gates merging on all three stages passing.

## What it does

**Trigger:** runs whenever a pull request is opened or updated against `master`.

**Stages** (each stage is a separate GitHub Actions "job"):

| Stage | What it does | Command |
|---|---|---|
| **build** | Installs dependencies and type-checks the whole TypeScript codebase (no output files — just catches type errors) | `npm run build` (→ `tsc --noEmit`) |
| **ui-tests** | Installs the Chromium browser and runs the UI test suite against Saucedemo | `npm run test:ui` (→ `playwright test --project=ui`) |
| **api-tests** | Runs the API test suite against the live Petstore sandbox (no browser needed) | `npm run test:api` (→ `playwright test --project=api`) |

`ui-tests` and `api-tests` both **depend on `build`** (`needs: build`) — if the code doesn't
compile, neither test stage runs. `ui-tests` and `api-tests` run in parallel with each other once
`build` succeeds.

If a test stage fails, its Playwright HTML report is uploaded as a downloadable artifact on the
workflow run page (`ui-test-report` / `api-test-report`), so you don't need to reproduce the
failure locally just to see what broke.

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
5. Search for and select the three job names: **Build (compile)**, **UI Tests**, **API Tests**.
   (They only appear in this list after the workflow has run at least once — open the PR first so
   GitHub Actions picks up the workflow, then come back to this step.)
6. Save the rule.

After that, GitHub will show these three checks on every PR and block the merge button until all
three are green.

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
