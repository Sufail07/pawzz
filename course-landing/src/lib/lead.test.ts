import {
  normalizePhone,
  toE164India,
  validateEmail,
  validateIndianPhone,
  validateIntroLead,
  validateName,
  validateSyllabusLead,
} from "./lead";

describe("validateName", () => {
  it("requires a name", () => {
    expect(validateName("")).toBe("Name is required");
    expect(validateName("   ")).toBe("Name is required");
  });

  it("requires two characters and a sane length", () => {
    expect(validateName("A")).toBeDefined();
    expect(validateName("An")).toBeUndefined();
    expect(validateName("x".repeat(81))).toBeDefined();
  });
});

describe("Indian phone validation", () => {
  it("accepts common formats and normalises them", () => {
    expect(validateIndianPhone("9876543210")).toBeUndefined();
    expect(validateIndianPhone("+91 98765 43210")).toBeUndefined();
    expect(validateIndianPhone("098765-43210")).toBeUndefined();
    expect(normalizePhone("+91 98765 43210")).toBe("9876543210");
    expect(toE164India("98765 43210")).toBe("+919876543210");
  });

  it("rejects empty, short and invalid prefixes", () => {
    expect(validateIndianPhone("")).toBeDefined();
    expect(validateIndianPhone("98765")).toBeDefined();
    expect(validateIndianPhone("5123456789")).toBeDefined();
    expect(validateIndianPhone("+91 51234 56789")).toBeDefined();
  });
});

describe("email validation", () => {
  it("requires a plausible email", () => {
    expect(validateEmail("")).toBe("Email is required");
    expect(validateEmail("not-an-email")).toBeDefined();
    expect(validateEmail("you@example.com")).toBeUndefined();
  });
});

describe("lead form validation", () => {
  const validIntro = {
    name: "Asha Menon",
    whatsapp: "9876543210",
    segment: "student" as const,
    track: "foundations" as const,
    preferredTime: "" as const,
    consent: true,
  };

  it("passes a complete intro lead", () => {
    expect(validateIntroLead(validIntro)).toEqual({});
  });

  it("flags missing consent and bad phone", () => {
    const errors = validateIntroLead({
      ...validIntro,
      whatsapp: "123",
      consent: false,
    });
    expect(errors.whatsapp).toBeDefined();
    expect(errors.consent).toBeDefined();
  });

  it("validates the syllabus form separately", () => {
    expect(
      validateSyllabusLead({ name: "", email: "", consent: false }),
    ).toMatchObject({
      name: expect.any(String),
      email: expect.any(String),
      consent: expect.any(String),
    });
    expect(
      validateSyllabusLead({
        name: "Asha",
        email: "asha@example.com",
        consent: true,
      }),
    ).toEqual({});
  });
});
