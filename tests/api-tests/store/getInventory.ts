import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApi } from '../BaseApi';

// GET /store/inventory — getInventory
export class GetInventoryEndpoint extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async send(options: { auth?: boolean } = { auth: true }): Promise<APIResponse> {
    return this.request.get('/store/inventory', {
      headers: options.auth === false ? {} : { api_key: 'test-api-key' },
    });
  }
}
