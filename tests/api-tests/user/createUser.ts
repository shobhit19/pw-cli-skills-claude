import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApi } from '../BaseApi';
import { User } from '../types';

// POST /user — createUser
export class CreateUserEndpoint extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async send(user: Partial<User>): Promise<APIResponse> {
    return this.request.post('user', { data: user });
  }
}
