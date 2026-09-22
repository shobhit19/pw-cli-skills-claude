import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApi } from '../BaseApi';
import { User } from '../types';

// PUT /user/{username} — updateUser
export class UpdateUserEndpoint extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async send(username: string, user: Partial<User>): Promise<APIResponse> {
    return this.request.put(`user/${username}`, { data: user });
  }
}
