import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApi } from '../BaseApi';

// GET /user/login — loginUser
export class LoginUserEndpoint extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async send(username?: string, password?: string): Promise<APIResponse> {
    const params: Record<string, string> = {};
    if (username !== undefined) params.username = username;
    if (password !== undefined) params.password = password;
    return this.request.get('user/login', { params });
  }
}
