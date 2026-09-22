import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApi } from '../BaseApi';
import { Order } from '../types';

// POST /store/order — placeOrder (no security declared in the spec)
export class PlaceOrderEndpoint extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async send(order: Partial<Order>): Promise<APIResponse> {
    return this.request.post('store/order', { data: order });
  }
}
