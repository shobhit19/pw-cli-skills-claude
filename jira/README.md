# Jira → Playwright automation pipeline

This folder is the entry point for turning a Jira test case into an executable Playwright test in
this framework. It does not introduce new generator/healer logic — it wires Jira ticket content
into the plan → generate → heal workflow that already exists in
`.claude/skills/playwright-cli/references/test-generation.md`.

## Folder layout

- `jira/tickets/` — one file per Jira ticket: a verbatim copy of the ticket's test case content
  (title, preconditions, steps, expected results), kept for traceability between the Jira ticket
  and the generated spec/tests.
- `jira/prompts.md` — standard, reusable prompts for fetching a ticket's test cases and turning
  them into a generated test script.
- `jira/README.md` — this file.

## Workflow

1. **Capture the ticket.** Copy the ticket's test case table(s) into `jira/tickets/<KEY>.md`
   verbatim — see `jira/tickets/KAN-4.md` for the format.
2. **Turn it into a spec.** Translate each Jira test case into a scenario in a
   `specs/<feature>.plan.md` file, using the same structure as `specs/saucedemo-login.md`
   (Application Overview, numbered `Steps:`, `- expect:` bullets per step). Add a `## Jira
   Reference` line linking back to the ticket.
3. **Generate.** Follow section 2 ("Generate") of
   `.claude/skills/playwright-cli/references/test-generation.md`: run the scenario group's seed
   test with `--debug=cli`, attach with `playwright-cli`, walk each step, and write the resulting
   Playwright code into `tests/<group>/<scenario>.spec.ts`.
4. **Run and heal.** Run the generated tests. Any failure goes through section 3 ("Heal") of the
   same reference: attach to the failing test, diagnose with `playwright-cli snapshot` /
   `console` / `requests`, fix the locator/assertion, and reconcile the spec if the app's real
   behaviour differs from what the ticket described.

## Current status: KAN-4

`jira/tickets/KAN-4.md`, `specs/codemify-homepage.plan.md`, and `tests/codemify/*.spec.ts`
implement the two smoke checks from
[KAN-4](https://test-automation-pw.atlassian.net/browse/KAN-4).

**These test files were written without live access to codemify.com.** This session's network
policy blocks outbound access to both `codemify.com` and `*.atlassian.net`, so the plan → generate
→ heal workflow's live-browser step (`playwright-cli attach`) could not be run against the real
page. The checks were deliberately kept generic (page responds successfully, title is non-empty,
a `navigation` landmark is visible with at least one link) so they're likely to hold regardless of
exact page copy, but they are **unverified**. Before relying on these tests, run them once in an
environment with network access and heal per section 3 of `test-generation.md` if a locator
doesn't match the real page:

```bash
PLAYWRIGHT_HTML_OPEN=never npx playwright test tests/codemify --debug=cli
# wait for the "Debugging Instructions" and the tw-XXXX session name
playwright-cli attach tw-XXXX
```
