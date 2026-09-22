# Codemify Homepage Test Plan

## Jira Reference

Source: [KAN-4](https://test-automation-pw.atlassian.net/browse/KAN-4) — see `jira/tickets/KAN-4.md`

## Application Overview

Codemify (https://codemify.com/) is the application under test. This plan covers baseline smoke
checks on the public homepage: confirming the page loads successfully and that primary navigation
is present and usable. Checks are intentionally kept generic (no page-specific copy) so they stay
stable as homepage content changes.

## Test Scenarios

### 1. Homepage Smoke Checks

**Seed:** `tests/codemify/seed.spec.ts`

#### 1.1. homepage-loads-successfully

**File:** `tests/codemify/homepage-loads-successfully.spec.ts`

**Steps:**
  1. Navigate to `https://codemify.com/`
    - expect: page responds successfully (no error page)
    - expect: page title is non-empty

#### 1.2. primary-navigation-visible

**File:** `tests/codemify/primary-navigation-visible.spec.ts`

**Steps:**
  1. Navigate to `https://codemify.com/`
    - expect: main navigation menu is visible
    - expect: at least one navigation link is present
