import { beforeEach, describe, expect, it } from "vitest";
import { checkRateLimit, resetRateLimits } from "./rate-limit.js";

describe("rate limiting", () => {
  beforeEach(() => resetRateLimits());

  it("allows requests up to the limit", () => {
    const first = checkRateLimit("client-a", 2);
    const second = checkRateLimit("client-a", 2);
    expect(first.allowed).toBe(true);
    expect(second.allowed).toBe(true);
    expect(second.remaining).toBe(0);
  });

  it("blocks requests after the limit and reports a retry window", () => {
    checkRateLimit("client-b", 1);
    const blocked = checkRateLimit("client-b", 1);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });

  it("keeps separate buckets per client", () => {
    checkRateLimit("client-c", 1);
    const other = checkRateLimit("client-d", 1);
    expect(other.allowed).toBe(true);
  });

  it("resets buckets", () => {
    checkRateLimit("client-e", 1);
    resetRateLimits();
    expect(checkRateLimit("client-e", 1).allowed).toBe(true);
  });
});
