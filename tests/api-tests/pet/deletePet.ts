import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApi } from '../BaseApi';

// DELETE /pet/{petId} — deletePet
export class DeletePetEndpoint extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async send(
    petId: number | string,
    options: { auth?: boolean } = { auth: true },
  ): Promise<APIResponse> {
    return this.request.delete(`/pet/${petId}`, {
      headers: options.auth === false ? {} : { Authorization: 'Bearer test-token' },
    });
  }
}
