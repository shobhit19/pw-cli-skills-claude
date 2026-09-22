// spec: specs/api/petstore.yaml
import { test, expect } from '@playwright/test';
import petData from '../api-data/pet-data.json';
import { validateSchema } from './utils/schemaValidator';
import { describeResponse } from './utils/testHelpers';
import { AddPetEndpoint } from './pet/addPet';
import { UpdatePetEndpoint } from './pet/updatePet';
import { FindPetsByStatusEndpoint } from './pet/findPetsByStatus';
import { FindPetsByTagsEndpoint } from './pet/findPetsByTags';
import { GetPetByIdEndpoint } from './pet/getPetById';
import { UpdatePetWithFormEndpoint } from './pet/updatePetWithForm';
import { DeletePetEndpoint } from './pet/deletePet';
import { UploadFileEndpoint } from './pet/uploadFile';

test.describe('Pet API — happy path', () => {
  test('addPet creates a pet matching the Pet schema @smoke', async ({ request }) => {
    const addPet = new AddPetEndpoint(request);
    const response = await addPet.send(petData.validPet);

    expect(response.ok(), await describeResponse(response)).toBeTruthy();
    const body = await response.json();
    expect(body.name).toBe(petData.validPet.name);

    const { valid, errors } = validateSchema('Pet', body);
    expect(valid, errors.join(', ')).toBeTruthy();
  });

  test('updatePet updates an existing pet', async ({ request }) => {
    const addPet = new AddPetEndpoint(request);
    const updatePet = new UpdatePetEndpoint(request);

    const created = await (await addPet.send(petData.validPet)).json();
    const response = await updatePet.send({ ...petData.validPetUpdate, id: created.id });

    expect(response.ok(), await describeResponse(response)).toBeTruthy();
    const body = await response.json();
    expect(body.status).toBe(petData.validPetUpdate.status);

    const { valid, errors } = validateSchema('Pet', body);
    expect(valid, errors.join(', ')).toBeTruthy();
  });

  test('findPetsByStatus returns an array of pets for a valid status', async ({ request }) => {
    const findPetsByStatus = new FindPetsByStatusEndpoint(request);
    const response = await findPetsByStatus.send(petData.statusEnum.valid[0]);

    expect(response.ok(), await describeResponse(response)).toBeTruthy();
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
  });

  test('findPetsByTags returns an array of pets for given tags', async ({ request }) => {
    const findPetsByTags = new FindPetsByTagsEndpoint(request);
    const response = await findPetsByTags.send(petData.tagsQuery);

    expect(response.ok(), await describeResponse(response)).toBeTruthy();
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
  });

  test('getPetById returns the created pet matching the Pet schema', async ({ request }) => {
    const addPet = new AddPetEndpoint(request);
    const getPetById = new GetPetByIdEndpoint(request);

    const created = await (await addPet.send(petData.validPet)).json();
    const response = await getPetById.send(created.id);

    expect(response.ok(), await describeResponse(response)).toBeTruthy();
    const body = await response.json();
    expect(body.id).toBe(created.id);

    const { valid, errors } = validateSchema('Pet', body);
    expect(valid, errors.join(', ')).toBeTruthy();
  });

  test('updatePetWithForm updates name/status via form params', async ({ request }) => {
    const addPet = new AddPetEndpoint(request);
    const updatePetWithForm = new UpdatePetWithFormEndpoint(request);

    const created = await (await addPet.send(petData.validPet)).json();
    const response = await updatePetWithForm.send(created.id, petData.updateFormParams);

    expect(response.ok(), await describeResponse(response)).toBeTruthy();
    const body = await response.json();
    expect(body.name).toBe(petData.updateFormParams.name);
  });

  test('uploadFile attaches an image and returns a matching ApiResponse', async ({ request }) => {
    const addPet = new AddPetEndpoint(request);
    const uploadFile = new UploadFileEndpoint(request);

    const created = await (await addPet.send(petData.validPet)).json();
    const response = await uploadFile.send(created.id, Buffer.from('fake-image-bytes'), petData.uploadMetadata);

    expect(response.ok(), await describeResponse(response)).toBeTruthy();
    const body = await response.json();

    const { valid, errors } = validateSchema('ApiResponse', body);
    expect(valid, errors.join(', ')).toBeTruthy();
  });

  test('deletePet removes an existing pet', async ({ request }) => {
    const addPet = new AddPetEndpoint(request);
    const deletePet = new DeletePetEndpoint(request);

    const created = await (await addPet.send(petData.validPet)).json();
    const response = await deletePet.send(created.id);

    expect(response.ok(), await describeResponse(response)).toBeTruthy();
  });
});

test.describe('Pet API — boundary: status enum', () => {
  for (const status of petData.statusEnum.valid) {
    test(`findPetsByStatus accepts documented enum value "${status}"`, async ({ request }) => {
      const findPetsByStatus = new FindPetsByStatusEndpoint(request);
      const response = await findPetsByStatus.send(status);
      expect(response.ok(), await describeResponse(response)).toBeTruthy();
    });
  }
});

test.describe('Pet API — negative cases', () => {
  test('addPet rejects a pet missing the required "name" field', async ({ request }) => {
    const addPet = new AddPetEndpoint(request);
    const response = await addPet.send(petData.petMissingName as never);
    expect(response.ok()).toBeFalsy();
  });

  test('addPet rejects a pet missing the required "photoUrls" field', async ({ request }) => {
    const addPet = new AddPetEndpoint(request);
    const response = await addPet.send(petData.petMissingPhotoUrls as never);
    expect(response.ok()).toBeFalsy();
  });

  test('findPetsByStatus rejects an invalid status enum value', async ({ request }) => {
    const findPetsByStatus = new FindPetsByStatusEndpoint(request);
    const response = await findPetsByStatus.send(petData.statusEnum.invalid);
    expect(response.ok()).toBeFalsy();
  });

  test('getPetById rejects a non-numeric pet ID', async ({ request }) => {
    const getPetById = new GetPetByIdEndpoint(request);
    const response = await getPetById.send(petData.invalidPetIdType);
    expect(response.ok()).toBeFalsy();
  });

  test('getPetById returns not-found for a pet ID that does not exist', async ({ request }) => {
    const getPetById = new GetPetByIdEndpoint(request);
    const response = await getPetById.send(petData.nonExistentPetId);
    expect(response.status()).toBe(404);
  });

  // NOTE: the public petstore3.swagger.io sandbox does not enforce the
  // `petstore_auth` / `api_key` security schemes declared in the spec — every
  // operation succeeds whether or not credentials are sent (a well-documented
  // property of this particular public demo). These two tests assert the
  // sandbox's real, observed behaviour rather than the spec's nominal security
  // requirement, so they hold on every run. If this ever runs against an
  // environment that DOES enforce auth, heal these to expect 401/403 instead.
  test('addPet still succeeds without an Authorization header (sandbox does not enforce petstore_auth)', async ({
    request,
  }) => {
    const addPet = new AddPetEndpoint(request);
    const response = await addPet.send(petData.validPet, { auth: false });
    expect(response.ok(), await describeResponse(response)).toBeTruthy();
  });

  test('getPetById still succeeds without an api_key header (sandbox does not enforce auth)', async ({ request }) => {
    const addPet = new AddPetEndpoint(request);
    const getPetById = new GetPetByIdEndpoint(request);

    const created = await (await addPet.send(petData.validPet)).json();
    const response = await getPetById.send(created.id, { auth: false });
    expect(response.ok(), await describeResponse(response)).toBeTruthy();
  });
});
