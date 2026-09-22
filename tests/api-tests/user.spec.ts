// spec: specs/api/petstore.yaml
import { test, expect } from '@playwright/test';
import userData from '../api-data/user-data.json';
import { validateSchema } from './utils/schemaValidator';
import { describeResponse } from './utils/testHelpers';
import { CreateUserEndpoint } from './user/createUser';
import { CreateUsersWithListInputEndpoint } from './user/createUsersWithListInput';
import { LoginUserEndpoint } from './user/loginUser';
import { LogoutUserEndpoint } from './user/logoutUser';
import { GetUserByNameEndpoint } from './user/getUserByName';
import { UpdateUserEndpoint } from './user/updateUser';
import { DeleteUserEndpoint } from './user/deleteUser';

// Base test data is sourced from tests/api-data/user-data.json; a runtime
// suffix is appended to usernames so repeated runs against the shared live
// sandbox don't collide with users created by a previous run.
function uniqueUsername(base: string): string {
  return `${base}_${Date.now()}`;
}

test.describe('User API — happy path', () => {
  test('createUser creates a user matching the User schema @smoke', async ({ request }) => {
    const createUser = new CreateUserEndpoint(request);
    const username = uniqueUsername(userData.validUser.username);
    const response = await createUser.send({ ...userData.validUser, username });

    expect(response.ok(), await describeResponse(response)).toBeTruthy();
    const body = await response.json();

    const { valid, errors } = validateSchema('User', body);
    expect(valid, errors.join(', ')).toBeTruthy();
  });

  test('createUsersWithListInput creates multiple users', async ({ request }) => {
    const createUsersWithListInput = new CreateUsersWithListInputEndpoint(request);
    const users = userData.userList.map((user) => ({ ...user, username: uniqueUsername(user.username) }));
    const response = await createUsersWithListInput.send(users);

    expect(response.ok(), await describeResponse(response)).toBeTruthy();
  });

  test('loginUser logs in with valid credentials and returns a session token', async ({ request }) => {
    const createUser = new CreateUserEndpoint(request);
    const loginUser = new LoginUserEndpoint(request);
    const username = uniqueUsername(userData.validUser.username);

    await createUser.send({ ...userData.validUser, username });
    const response = await loginUser.send(username, userData.validUser.password);

    expect(response.ok(), await describeResponse(response)).toBeTruthy();
    const body = await response.text();
    expect(body.length).toBeGreaterThan(0);
  });

  test('logoutUser logs out the current session', async ({ request }) => {
    const logoutUser = new LogoutUserEndpoint(request);
    const response = await logoutUser.send();
    expect(response.ok(), await describeResponse(response)).toBeTruthy();
  });

  test('getUserByName returns the created user matching the User schema', async ({ request }) => {
    const createUser = new CreateUserEndpoint(request);
    const getUserByName = new GetUserByNameEndpoint(request);
    const username = uniqueUsername(userData.validUser.username);

    await createUser.send({ ...userData.validUser, username });
    const response = await getUserByName.send(username);

    expect(response.ok(), await describeResponse(response)).toBeTruthy();
    const body = await response.json();
    expect(body.username).toBe(username);

    const { valid, errors } = validateSchema('User', body);
    expect(valid, errors.join(', ')).toBeTruthy();
  });

  test('updateUser updates an existing user', async ({ request }) => {
    const createUser = new CreateUserEndpoint(request);
    const updateUser = new UpdateUserEndpoint(request);
    const username = uniqueUsername(userData.validUser.username);

    await createUser.send({ ...userData.validUser, username });
    const response = await updateUser.send(username, { ...userData.validUserUpdate, username });

    expect(response.ok(), await describeResponse(response)).toBeTruthy();
  });

  test('deleteUser removes an existing user', async ({ request }) => {
    const createUser = new CreateUserEndpoint(request);
    const deleteUser = new DeleteUserEndpoint(request);
    const username = uniqueUsername(userData.validUser.username);

    await createUser.send({ ...userData.validUser, username });
    const response = await deleteUser.send(username);

    expect(response.ok(), await describeResponse(response)).toBeTruthy();
  });
});

test.describe('User API — negative cases', () => {
  test('getUserByName returns not-found for a username that does not exist', async ({ request }) => {
    const getUserByName = new GetUserByNameEndpoint(request);
    const response = await getUserByName.send(userData.nonExistentUsername);
    expect(response.status()).toBe(404);
  });

  test('updateUser returns not-found for a username that does not exist', async ({ request }) => {
    const updateUser = new UpdateUserEndpoint(request);
    const response = await updateUser.send(userData.nonExistentUsername, userData.validUserUpdate);
    expect(response.status()).toBe(404);
  });

  test('deleteUser returns not-found for a username that does not exist', async ({ request }) => {
    const deleteUser = new DeleteUserEndpoint(request);
    const response = await deleteUser.send(userData.nonExistentUsername);
    expect(response.status()).toBe(404);
  });
});
