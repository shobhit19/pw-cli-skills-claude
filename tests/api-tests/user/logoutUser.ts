import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApi } from '../BaseApi';

// GET /user/logout — logoutUser
export class LogoutUserEndpoint extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async send(): Promise<APIResponse> {
    return this.request.get('user/logout');
  }
}
