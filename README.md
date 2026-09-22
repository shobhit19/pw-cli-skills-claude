# pw-cli-skills

Playwright + TypeScript test automation framework, authored and maintained with the
`playwright-cli` Claude Code skill (`.claude/skills/playwright-cli/`) using its plan → generate →
heal workflow.

## Setup

```bash
npm install
npx playwright install   # browsers, if not already present
```

## Project structure

```
playwright.config.ts        # 'ui' and 'api' projects (separate baseURLs, see below)
src/
  fixtures/base.ts          # custom test fixture, extends @playwright/test
  pages/                    # Page Object Model classes for UI tests
specs/
  saucedemo-login.md        # UI test plan (plan/generate/heal spec format)
  api/petstore.yaml         # OpenAPI spec driving the API test suite
tests/
  seed.spec.ts              # UI seed test — lands the app in its starting state
  auth/                     # UI test specs
  data/                     # JSON test data for UI tests
  api-tests/                # API test suite (see tests/api-tests/README.md)
  api-data/                 # JSON test data for API tests
```

## UI Automation

### Target application

The UI suite exercises [Saucedemo](https://www.saucedemo.com), a demo e-commerce app. The `ui`
Playwright project (in `playwright.config.ts`) sets `baseURL: 'https://www.saucedemo.com'` and
`testIdAttribute: 'data-test'`, and is scoped to everything under `tests/` except `api-tests/`.

### Page Object Model pattern

UI tests follow a POM pattern under `src/pages/`:

- **`BasePage.ts`** — abstract base class every page object extends. Holds `protected readonly
  page: Page` and requires a `goto(): Promise<void>` implementation.
- **`LoginPage.ts`**, **`InventoryPage.ts`** — concrete page objects. Locators are exposed as
  getters using role-based / test-id locators (`getByRole`, `getByTestId`) rather than raw CSS
  selectors; actions are `async` methods that each wrap a single interaction (e.g.
  `fillUsername`, `submit`).

Page objects are instantiated directly inside each test (`new LoginPage(page)`), not injected via
fixtures.

### Test data

UI test data is externalized to JSON under `tests/data/` (e.g. `users.json`) and imported directly
— no hardcoded credentials or payloads in the spec files.

### Seed tests

A **seed test** (`tests/seed.spec.ts`) is the minimal test that lands the app in the state every
scenario assumes as its starting point (navigation, any required setup). It's also the entry point
the `playwright-cli` plan/generate/heal workflow attaches to when exploring the app or authoring
new tests.

### Existing UI tests

- `tests/seed.spec.ts` — seed test, navigates to the Saucedemo homepage.
- `tests/auth/standard-login.spec.ts` — standard user logs in successfully (`@smoke @critical`).

### Running the UI suite

```bash
npx playwright test --project=ui
npx playwright show-report
```

### Adding new UI tests

New UI scenarios are authored with the `playwright-cli` skill's plan → generate → heal workflow
(`.claude/skills/playwright-cli/references/test-generation.md`):

1. **Plan** — explore the app interactively via `playwright-cli attach`, then write a spec to
   `specs/<feature>.plan.md` (see `specs/saucedemo-login.md` for the format: Application Overview,
   numbered `Steps:`, `- expect:` bullets).
2. **Generate** — walk each scenario's steps live via `playwright-cli`, then write the generated
   Playwright code to `tests/<group>/<scenario>.spec.ts`, reusing an existing page object under
   `src/pages/` or adding a new one that extends `BasePage`.
3. **Heal** — if a generated or existing test fails, attach to it in debug mode, diagnose with
   `playwright-cli snapshot` / `console` / `requests`, fix the locator/assertion, and reconcile the
   spec if the app's real behaviour has changed.

## API Automation

A separate `tests/api-tests/` suite, generated from `specs/api/petstore.yaml`, runs under the
`api` Playwright project (`baseURL: 'https://petstore3.swagger.io/api/v3'`). It follows the same
POM-style pattern as the UI suite (`BaseApi` instead of `BasePage`, one class per operation instead
of per page). See **`tests/api-tests/README.md`** for full details, conventions, and known caveats.

```bash
npx playwright test --project=api
```

## Running everything

```bash
npx playwright test          # both 'ui' and 'api' projects
```
