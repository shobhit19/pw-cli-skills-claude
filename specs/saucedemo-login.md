# Saucedemo Login Test Plan

## Application Overview

Saucedemo (https://www.saucedemo.com) is a demo e-commerce app ("Swag Labs") whose entry point is a
username/password login form. The form has three elements: a `Username` textbox
(`[data-test="username"]`), a `Password` textbox (`[data-test="password"]`), and a `Login` button
(`[data-test="login-button"]`). A successful login navigates to `/inventory.html` (the "Products"
listing page). A failed login stays on `/` and renders an `alert` region containing a
"Dismiss error" button and an "Epic sadface: ..." message. The app exposes six seeded usernames
(`standard_user`, `locked_out_user`, `problem_user`, `performance_glitch_user`, `error_user`,
`visual_user`); all valid users share the password `secret_sauce`.

## Test Scenarios

### 1. Login

**Seed:** `tests/seed.spec.ts`

#### 1.1. successful-login-standard-user

**File:** `tests/login/successful-login-standard-user.spec.ts`

**Steps:**
  1. Type "standard_user" into the Username field
    - expect: field contains "standard_user"
  2. Type "secret_sauce" into the Password field
    - expect: field contains "secret_sauce"
  3. Click the Login button
    - expect: page navigates to `/inventory.html`
    - expect: the "Products" page title is visible

#### 1.2. locked-out-user-shows-error

**File:** `tests/login/locked-out-user-shows-error.spec.ts`

**Steps:**
  1. Type "locked_out_user" into the Username field
  2. Type "secret_sauce" into the Password field
  3. Click the Login button
    - expect: page stays on `/` (no navigation to inventory)
    - expect: an error alert is visible containing the text "Epic sadface: Sorry, this user has been locked out."

#### 1.3. empty-username-shows-error

**File:** `tests/login/empty-username-shows-error.spec.ts`

**Steps:**
  1. Leave the Username field empty
  2. Type "secret_sauce" into the Password field
  3. Click the Login button
    - expect: page stays on `/` (no navigation to inventory)
    - expect: an error alert is visible containing the text "Epic sadface: Username is required"

#### 1.4. empty-password-shows-error

**File:** `tests/login/empty-password-shows-error.spec.ts`

**Steps:**
  1. Type "standard_user" into the Username field
  2. Leave the Password field empty
  3. Click the Login button
    - expect: page stays on `/` (no navigation to inventory)
    - expect: an error alert is visible containing the text "Epic sadface: Password is required"

#### 1.5. invalid-credentials-shows-error

**File:** `tests/login/invalid-credentials-shows-error.spec.ts`

**Steps:**
  1. Type "foo" into the Username field
  2. Type "bar" into the Password field
  3. Click the Login button
    - expect: page stays on `/` (no navigation to inventory)
    - expect: an error alert is visible containing the text "Epic sadface: Username and password do not match any user in this service"
