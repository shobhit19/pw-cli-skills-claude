import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApi } from '../BaseApi';
import { User } from '../types';

// POST /user/createWithList — createUsersWithListInput
export class CreateUsersWithListInputEndpoint extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async send(users: Partial<User>[]): Promise<APIResponse> {
    return this.request.post('user/createWithList', { data: users });
  }
}
