import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApi } from '../BaseApi';

// POST /pet/{petId}/uploadImage — uploadFile
export class UploadFileEndpoint extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async send(
    petId: number | string,
    fileBuffer: Buffer,
    additionalMetadata?: string,
    options: { auth?: boolean } = { auth: true },
  ): Promise<APIResponse> {
    return this.request.post(`pet/${petId}/uploadImage`, {
      params: additionalMetadata ? { additionalMetadata } : {},
      headers: {
        'Content-Type': 'application/octet-stream',
        ...(options.auth === false ? {} : { Authorization: 'Bearer test-token' }),
      },
      data: fileBuffer,
    });
  }
}
