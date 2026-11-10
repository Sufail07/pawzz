import type { UtmStore } from "./utm";
import { captureUtm, readUtm, resetUtmForTests } from "./utm";

function memoryStore(): UtmStore {
  const map = new Map<string, string>();
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, value);
    },
  };
}

beforeEach(() => {
  resetUtmForTests();
});

describe("UTM capture", () => {
  it("captures source, medium and campaign from the query string", () => {
    const store = memoryStore();
    const utm = captureUtm(
      "?utm_source=instagram&utm_medium=social&utm_campaign=launch",
      store,
    );
    expect(utm).toEqual({
      utm_source: "instagram",
      utm_medium: "social",
      utm_campaign: "launch",
    });
    expect(readUtm(store)).toEqual(utm);
  });

  it("keeps first-touch values and fills only missing ones", () => {
    const store = memoryStore();
    captureUtm("?utm_source=linkedin", store);
    const merged = captureUtm(
      "?utm_source=instagram&utm_campaign=october",
      store,
    );
    expect(merged.utm_source).toBe("linkedin");
    expect(merged.utm_campaign).toBe("october");
    expect(merged.utm_medium).toBe("");
  });

  it("survives a broken stored value", () => {
    const store = memoryStore();
    store.setItem("lumen.utm.v1", "{not json");
    const utm = captureUtm("?utm_source=whatsapp", store);
    expect(utm.utm_source).toBe("whatsapp");
    expect(utm.utm_medium).toBe("");
  });

  it("returns blanks when nothing was captured", () => {
    expect(readUtm(memoryStore())).toEqual({
      utm_source: "",
      utm_medium: "",
      utm_campaign: "",
    });
  });
});
