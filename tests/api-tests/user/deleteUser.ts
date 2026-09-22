import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApi } from '../BaseApi';

// DELETE /user/{username} — deleteUser
export class DeleteUserEndpoint extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async send(username: string): Promise<APIResponse> {
    return this.request.delete(`user/${username}`);
  }
}
