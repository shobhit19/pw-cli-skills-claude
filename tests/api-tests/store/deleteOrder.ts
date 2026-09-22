import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApi } from '../BaseApi';

// DELETE /store/order/{orderId} — deleteOrder (no security declared)
// Documented quirk: only IDs <1000 return a successful response;
// anything above 1000 (or a non-integer) generates an API error.
export class DeleteOrderEndpoint extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async send(orderId: number | string): Promise<APIResponse> {
    return this.request.delete(`store/order/${orderId}`);
  }
}
