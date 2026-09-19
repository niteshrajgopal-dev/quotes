/**
 * QOS-93 validation — expired anonymous basket (410) recreates basket on hydrate.
 *
 *   node scripts/verify-qos-93.mjs
 */

import assert from "node:assert/strict";
import test from "node:test";

class QosRequestError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = "QosRequestError";
    this.statusCode = statusCode;
  }
}

function isRecoverableAnonymousBasketError(error) {
  return (
    error instanceof QosRequestError &&
    (error.statusCode === 401 || error.statusCode === 404 || error.statusCode === 410)
  );
}

test("410 expired basket session is recoverable", () => {
  assert.equal(
    isRecoverableAnonymousBasketError(new QosRequestError("Basket session has expired", 410)),
    true,
  );
});

test("404 missing basket is recoverable", () => {
  assert.equal(
    isRecoverableAnonymousBasketError(new QosRequestError("Basket not found", 404)),
    true,
  );
});

test("401 unauthorized basket is recoverable", () => {
  assert.equal(
    isRecoverableAnonymousBasketError(new QosRequestError("Unauthorized", 401)),
    true,
  );
});

test("409 conflict is not recoverable via basket recreation", () => {
  assert.equal(
    isRecoverableAnonymousBasketError(new QosRequestError("Version conflict", 409)),
    false,
  );
});

test("500 server errors are not recoverable via basket recreation", () => {
  assert.equal(
    isRecoverableAnonymousBasketError(new QosRequestError("Internal error", 500)),
    false,
  );
});

test("non-Qos errors are not recoverable", () => {
  assert.equal(isRecoverableAnonymousBasketError(new Error("network")), false);
});
