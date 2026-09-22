import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApi } from '../BaseApi';

// GET /pet/{petId} — getPetById
// security: api_key OR petstore_auth (either credential satisfies it)
export class GetPetByIdEndpoint extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async send(
    petId: number | string,
    options: { auth?: boolean } = { auth: true },
  ): Promise<APIResponse> {
    return this.request.get(`/pet/${petId}`, {
      headers: options.auth === false ? {} : { api_key: 'test-api-key' },
    });
  }
}
