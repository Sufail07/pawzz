import { beforeEach, describe, expect, it } from "vitest";
import {
  submitForm,
  validateEmail,
  validateLink,
  validatePhone,
} from "./forms";

describe("form validation", () => {
  it("accepts realistic Indian phone numbers", () => {
    expect(validatePhone("+91 98470 11001")).toBeUndefined();
    expect(validatePhone("9847011001")).toBeUndefined();
  });

  it("rejects empty and short phone numbers", () => {
    expect(validatePhone("")).toBe("Phone number is required");
    expect(validatePhone("12345")).toBeDefined();
    expect(validatePhone("123456789012345")).toBeDefined();
  });

  it("validates optional email addresses", () => {
    expect(validateEmail("")).toBeUndefined();
    expect(validateEmail("hello@example.com")).toBeUndefined();
    expect(validateEmail("hello@example")).toBeDefined();
    expect(validateEmail("not an email")).toBeDefined();
  });

  it("validates optional proof links", () => {
    expect(validateLink("")).toBeUndefined();
    expect(validateLink("https://example.com/listing")).toBeUndefined();
    expect(validateLink("http://example.com")).toBeUndefined();
    expect(validateLink("example.com")).toBeDefined();
    expect(validateLink("javascript:alert(1)")).toBeDefined();
  });
});

describe("submitForm without an endpoint", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("stores a submission locally and returns a reference", async () => {
    const result = await submitForm("correction", { details: "Wrong number" });
    expect(result.reference).toMatch(/^PZ-/);
    expect(result.delivered).toBe(false);

    const stored = JSON.parse(
      window.localStorage.getItem("pawzz.submissions.v1") ?? "[]",
    );
    expect(stored).toHaveLength(1);
    expect(stored[0].kind).toBe("correction");
    expect(stored[0].payload.details).toBe("Wrong number");
  });

  it("keeps a newest-first history capped in storage", async () => {
    await submitForm("list-business", { name: "One" });
    await submitForm("list-business", { name: "Two" });
    const stored = JSON.parse(
      window.localStorage.getItem("pawzz.submissions.v1") ?? "[]",
    );
    expect(stored[0].payload.name).toBe("Two");
    expect(stored[1].payload.name).toBe("One");
  });
});
