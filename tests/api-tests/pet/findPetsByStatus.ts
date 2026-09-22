import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApi } from '../BaseApi';

// GET /pet/findByStatus — findPetsByStatus
export class FindPetsByStatusEndpoint extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async send(status: string, options: { auth?: boolean } = { auth: true }): Promise<APIResponse> {
    return this.request.get('/pet/findByStatus', {
      params: { status },
      headers: options.auth === false ? {} : { Authorization: 'Bearer test-token' },
    });
  }
}
