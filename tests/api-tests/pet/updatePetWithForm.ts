import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApi } from '../BaseApi';

// POST /pet/{petId} — updatePetWithForm
export class UpdatePetWithFormEndpoint extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async send(
    petId: number | string,
    params: { name?: string; status?: string },
    options: { auth?: boolean } = { auth: true },
  ): Promise<APIResponse> {
    return this.request.post(`/pet/${petId}`, {
      params,
      headers: options.auth === false ? {} : { Authorization: 'Bearer test-token' },
    });
  }
}
