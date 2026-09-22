import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApi } from '../BaseApi';
import { Pet } from '../types';

// POST /pet — addPet
export class AddPetEndpoint extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async send(pet: Partial<Pet>, options: { auth?: boolean } = { auth: true }): Promise<APIResponse> {
    return this.request.post('pet', {
      data: pet,
      headers: options.auth === false ? {} : { Authorization: 'Bearer test-token' },
    });
  }
}
