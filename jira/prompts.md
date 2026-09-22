# Standard prompts

Reusable prompts for the two stages of the Jira → Playwright pipeline described in
`jira/README.md`. Substitute `<TICKET_KEY>` / `<feature>` and paste as-is.

## 1. Fetch test cases from Jira

Requires the Atlassian MCP connector to be connected (claude.ai → Settings → Connectors →
Atlassian, authorized against the Jira site).

```
Fetch the Jira ticket at https://test-automation-pw.atlassian.net/browse/<TICKET_KEY> using the
Atlassian MCP connector (getJiraIssue). Extract every test case defined in it — title,
precondition, test steps, expected results, priority, type. Save the extracted content verbatim
to jira/tickets/<TICKET_KEY>.md, matching the table format in jira/tickets/KAN-4.md. Do not
fabricate or infer content that isn't in the ticket — if a field is missing, write
"Not specified" and flag it to me.
```

## 2. Generate the test script from the fetched steps

```
Using jira/tickets/<TICKET_KEY>.md, create/update specs/<feature>.plan.md in the format of
specs/saucedemo-login.md (Application Overview, numbered Steps:, - expect: bullets), with a
## Jira Reference line linking back to the ticket. Then follow the Generate workflow in
.claude/skills/playwright-cli/references/test-generation.md §2: run the scenario's seed test with
--debug=cli, attach via playwright-cli, walk each step, and write the generated Playwright code to
tests/<group>/<scenario>.spec.ts, reusing a Page Object under src/pages/ (extending BasePage)
where one exists or adding one if the page is new. Add an assertion for every - expect: bullet
using role-based locators. Run the test once; if it fails, follow §3 (Heal) to fix it — never skip
hooks or add sleeps. Confirm green before reporting the ticket's test case as automated.
```
