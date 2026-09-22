import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApi } from '../BaseApi';

// GET /store/order/{orderId} — getOrderById (no security declared)
// Documented quirk: only IDs <=5 or >10 return a successful response;
// IDs in between (6-10) generate an exception.
export class GetOrderByIdEndpoint extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async send(orderId: number | string): Promise<APIResponse> {
    return this.request.get(`store/order/${orderId}`);
  }
}
