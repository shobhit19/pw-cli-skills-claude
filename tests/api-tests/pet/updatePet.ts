import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApi } from '../BaseApi';
import { Pet } from '../types';

// PUT /pet — updatePet
export class UpdatePetEndpoint extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async send(pet: Partial<Pet>, options: { auth?: boolean } = { auth: true }): Promise<APIResponse> {
    return this.request.put('/pet', {
      data: pet,
      headers: options.auth === false ? {} : { Authorization: 'Bearer test-token' },
    });
  }
}
