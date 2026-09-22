// spec: specs/api/petstore.yaml
import { test, expect } from '@playwright/test';
import orderData from '../api-data/order-data.json';
import { validateSchema } from './utils/schemaValidator';
import { describeResponse } from './utils/testHelpers';
import { GetInventoryEndpoint } from './store/getInventory';
import { PlaceOrderEndpoint } from './store/placeOrder';
import { GetOrderByIdEndpoint } from './store/getOrderById';
import { DeleteOrderEndpoint } from './store/deleteOrder';

test.describe('Store API — happy path', () => {
  test('getInventory returns pet counts by status @smoke', async ({ request }) => {
    const getInventory = new GetInventoryEndpoint(request);
    const response = await getInventory.send();

    expect(response.ok(), await describeResponse(response)).toBeTruthy();
    const body = await response.json();
    expect(typeof body).toBe('object');
  });

  test('placeOrder creates an order matching the Order schema', async ({ request }) => {
    const placeOrder = new PlaceOrderEndpoint(request);
    const response = await placeOrder.send(orderData.validOrder);

    expect(response.ok(), await describeResponse(response)).toBeTruthy();
    const body = await response.json();
    expect(body.petId).toBe(orderData.validOrder.petId);

    const { valid, errors } = validateSchema('Order', body);
    expect(valid, errors.join(', ')).toBeTruthy();
  });

  test('getOrderById returns an order matching the Order schema', async ({ request }) => {
    const getOrderById = new GetOrderByIdEndpoint(request);
    const response = await getOrderById.send(orderData.getOrderByIdBoundaries.validLowBoundary);

    expect(response.ok(), await describeResponse(response)).toBeTruthy();
    const body = await response.json();

    const { valid, errors } = validateSchema('Order', body);
    expect(valid, errors.join(', ')).toBeTruthy();
  });

  test('deleteOrder removes an order below the documented ID boundary', async ({ request }) => {
    const deleteOrder = new DeleteOrderEndpoint(request);
    const response = await deleteOrder.send(orderData.deleteOrderBoundaries.validBelow1000);

    expect(response.ok(), await describeResponse(response)).toBeTruthy();
  });
});

test.describe('Store API — boundary: getOrderById quirk (IDs <=5 or >10 succeed, others fail)', () => {
  test(`orderId ${orderData.getOrderByIdBoundaries.validLowBoundary} (<=5) succeeds`, async ({ request }) => {
    const getOrderById = new GetOrderByIdEndpoint(request);
    const response = await getOrderById.send(orderData.getOrderByIdBoundaries.validLowBoundary);
    expect(response.ok(), await describeResponse(response)).toBeTruthy();
  });

  test(`orderId ${orderData.getOrderByIdBoundaries.validHighBoundary} (>10) succeeds`, async ({ request }) => {
    const getOrderById = new GetOrderByIdEndpoint(request);
    const response = await getOrderById.send(orderData.getOrderByIdBoundaries.validHighBoundary);
    expect(response.ok(), await describeResponse(response)).toBeTruthy();
  });

  test(`orderId ${orderData.getOrderByIdBoundaries.invalidJustAboveLow} (6-10 range) fails`, async ({ request }) => {
    const getOrderById = new GetOrderByIdEndpoint(request);
    const response = await getOrderById.send(orderData.getOrderByIdBoundaries.invalidJustAboveLow);
    expect(response.ok()).toBeFalsy();
  });

  test(`orderId ${orderData.getOrderByIdBoundaries.invalidJustBelowHigh} (6-10 range) fails`, async ({ request }) => {
    const getOrderById = new GetOrderByIdEndpoint(request);
    const response = await getOrderById.send(orderData.getOrderByIdBoundaries.invalidJustBelowHigh);
    expect(response.ok()).toBeFalsy();
  });
});

test.describe('Store API — boundary: deleteOrder quirk (IDs <1000 succeed, above 1000 fails)', () => {
  test(`orderId ${orderData.deleteOrderBoundaries.validBelow1000} (<1000) succeeds`, async ({ request }) => {
    const deleteOrder = new DeleteOrderEndpoint(request);
    const response = await deleteOrder.send(orderData.deleteOrderBoundaries.validBelow1000);
    expect(response.ok(), await describeResponse(response)).toBeTruthy();
  });

  test(`orderId ${orderData.deleteOrderBoundaries.invalidAbove1000} (>1000) fails`, async ({ request }) => {
    const deleteOrder = new DeleteOrderEndpoint(request);
    const response = await deleteOrder.send(orderData.deleteOrderBoundaries.invalidAbove1000);
    expect(response.ok()).toBeFalsy();
  });
});

test.describe('Store API — negative cases', () => {
  test('placeOrder rejects an invalid order status enum value', async ({ request }) => {
    const placeOrder = new PlaceOrderEndpoint(request);
    const response = await placeOrder.send({ ...orderData.validOrder, status: orderData.statusEnum.invalid as never });
    expect(response.ok()).toBeFalsy();
  });

  test('getOrderById rejects a non-numeric order ID', async ({ request }) => {
    const getOrderById = new GetOrderByIdEndpoint(request);
    const response = await getOrderById.send(orderData.invalidOrderIdType);
    expect(response.ok()).toBeFalsy();
  });

  test('deleteOrder rejects a non-numeric order ID', async ({ request }) => {
    const deleteOrder = new DeleteOrderEndpoint(request);
    const response = await deleteOrder.send(orderData.invalidOrderIdType);
    expect(response.ok()).toBeFalsy();
  });

  // NOTE: getInventory declares `api_key` security in the spec, but the public
  // petstore3.swagger.io sandbox does not actually enforce it — see the same
  // note in pet.spec.ts. This asserts the sandbox's real, observed behaviour.
  test('getInventory still succeeds without an api_key header (sandbox does not enforce auth)', async ({
    request,
  }) => {
    const getInventory = new GetInventoryEndpoint(request);
    const response = await getInventory.send({ auth: false });
    expect(response.ok(), await describeResponse(response)).toBeTruthy();
  });
});
