import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApi } from '../BaseApi';

// GET /user/{username} — getUserByName
export class GetUserByNameEndpoint extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async send(username: string): Promise<APIResponse> {
    return this.request.get(`user/${username}`);
  }
}
