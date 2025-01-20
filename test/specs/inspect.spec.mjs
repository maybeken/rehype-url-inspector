import process from "../utils/process.mjs";
import compare from "../utils/compare.mjs";
import sinon from "sinon";
import { expect } from "chai";
import { describe, it } from "mocha";

describe("options.inspect", () => {

  it("should be called with all the URLs on the page", async () => {
    let inspect = sinon.spy();
    await process("test/fixtures/many-urls.html", { inspect });

    sinon.assert.calledOnce(inspect);
    expect(inspect.firstCall.args).to.have.lengthOf(1);
    compare(inspect.firstCall.args[0], [
      { tag: "link", prop: "href", url: "http://localhost:8080/fizz/buzz" },
      { tag: "meta", prop: "content", url: "http://localhost:8080/fizz/buzz" },
      { tag: "meta", prop: "content", url: "//example.com/img/media/twitter-card.png" },
      { tag: "meta", prop: "content", url: "//example.com/home?ref=url&media=" },
      { tag: "meta", prop: "content", url: "http://localhost:8080/img/media/twitter-card.png" },
      { tag: "link", prop: "href", url: "/site.webmanifest" },
      { tag: "link", prop: "href", url: "/img/favicon-32x32.png" },
      { tag: "link", prop: "href", url: "/css/main.css?v=5" },
      { tag: "img", prop: "src", url: "/img/logo.svg" },
      { tag: "a", prop: "href", url: "http://example.com/foo/bar/" },
      { tag: "a", prop: "href", url: "some-page.html" },
      { tag: "img", prop: "src", url: "img/sales/charg.svg" },
      { tag: "script", prop: "src", url: "js/script.js" },
    ]);
  });

});
