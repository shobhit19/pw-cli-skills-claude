import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApi } from '../BaseApi';

// GET /pet/findByTags — findPetsByTags
export class FindPetsByTagsEndpoint extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async send(tags: string[], options: { auth?: boolean } = { auth: true }): Promise<APIResponse> {
    return this.request.get('pet/findByTags', {
      params: { tags: tags.join(',') },
      headers: options.auth === false ? {} : { Authorization: 'Bearer test-token' },
    });
  }
}
