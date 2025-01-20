import { default as defaultExport, inspectUrls as namedExport } from "../../lib/index.js";
import { expect } from "chai";
import { describe, it } from "mocha";

describe("rehype-url-inspector package exports", () => {
  it("should export the inspectUrls() function as the default ESM export", () => {
    expect(defaultExport).to.be.a("function");
  });

  it("should export the inspectUrls() function as a named export", () => {
    expect(namedExport).to.be.a("function");
  });
});
