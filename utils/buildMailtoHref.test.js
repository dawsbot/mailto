import { describe, it, expect } from "vitest";
import { buildMailtoHref, parameters } from "./buildMailtoHref";

describe("parameters", () => {
  it("exposes the supported mailto form fields", () => {
    expect(parameters).toEqual(["to", "cc", "bcc", "subject", "body"]);
  });
});

describe("buildMailtoHref", () => {
  it("returns a bare mailto for empty input", () => {
    expect(buildMailtoHref()).toBe("mailto:");
    expect(buildMailtoHref({})).toBe("mailto:");
    expect(
      buildMailtoHref({ to: "", cc: "", bcc: "", subject: "", body: "" }),
    ).toBe("mailto:");
  });

  it("puts `to` in the address part, unencoded", () => {
    expect(buildMailtoHref({ to: "friend@example.com" })).toBe(
      "mailto:friend@example.com",
    );
  });

  it("supports multiple comma-separated recipients", () => {
    expect(buildMailtoHref({ to: "a@example.com,b@example.com" })).toBe(
      "mailto:a@example.com,b@example.com",
    );
  });

  it("omits empty parameters from the query string", () => {
    expect(
      buildMailtoHref({ to: "a@example.com", cc: "", subject: "hi", body: "" }),
    ).toBe("mailto:a@example.com?subject=hi");
  });

  it("joins multiple parameters with & in a stable order", () => {
    expect(
      buildMailtoHref({
        to: "a@example.com",
        cc: "c@example.com",
        bcc: "d@example.com",
        subject: "hello",
        body: "world",
      }),
    ).toBe(
      "mailto:a@example.com?cc=c%40example.com&bcc=d%40example.com&subject=hello&body=world",
    );
  });

  it("builds a query string even when `to` is empty", () => {
    expect(buildMailtoHref({ subject: "hello" })).toBe("mailto:?subject=hello");
  });

  it("URI-encodes spaces and special characters", () => {
    expect(buildMailtoHref({ subject: "hello world" })).toBe(
      "mailto:?subject=hello%20world",
    );
    expect(buildMailtoHref({ body: "a & b = c ? d # e" })).toBe(
      "mailto:?body=a%20%26%20b%20%3D%20c%20%3F%20d%20%23%20e",
    );
  });

  it("URI-encodes emoji", () => {
    expect(buildMailtoHref({ subject: "💌" })).toBe(
      "mailto:?subject=%F0%9F%92%8C",
    );
  });

  // https://github.com/dawsbot/mailto/issues/36
  it("encodes newlines as %0D%0A for mobile gmail compatibility", () => {
    expect(buildMailtoHref({ body: "line one\nline two" })).toBe(
      "mailto:?body=line%20one%0D%0Aline%20two",
    );
  });

  it("encodes consecutive and trailing newlines", () => {
    expect(buildMailtoHref({ body: "a\n\nb\n" })).toBe(
      "mailto:?body=a%0D%0A%0D%0Ab%0D%0A",
    );
  });

  it("encodes newlines in every field, not just body", () => {
    expect(buildMailtoHref({ body: "x\ny", subject: "p\nq" })).toBe(
      "mailto:?subject=p%0D%0Aq&body=x%0D%0Ay",
    );
  });

  it("ignores unknown keys", () => {
    expect(buildMailtoHref({ to: "a@example.com", nope: "x" })).toBe(
      "mailto:a@example.com",
    );
  });
});
