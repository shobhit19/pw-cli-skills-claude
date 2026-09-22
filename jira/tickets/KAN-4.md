# KAN-4

**Jira URL:** https://test-automation-pw.atlassian.net/browse/KAN-4
**Type:** Story
**Summary:** Add automated smoke tests for Codemify homepage

## Test Case 1

| Field | Value |
|---|---|
| Test Case ID | TC-CODEMIFY-001 |
| Title | Homepage loads successfully |
| Precondition | None (no login required) |
| Test Steps | 1. Navigate to `https://codemify.com/` |
| Expected Result | 1. Page responds with HTTP 200 (no error page)<br>2. Page title is non-empty<br>3. Page finishes loading within a reasonable time (no perpetual spinner) |
| Priority | High |
| Type | Smoke |

## Test Case 2

| Field | Value |
|---|---|
| Test Case ID | TC-CODEMIFY-002 |
| Title | Primary navigation menu is visible on homepage |
| Precondition | User is on the homepage (`https://codemify.com/`) |
| Test Steps | 1. Navigate to `https://codemify.com/`<br>2. Observe the main navigation/header area |
| Expected Result | 1. The main navigation menu is visible<br>2. At least one navigation link is present and clickable |
| Priority | High |
| Type | Smoke |
