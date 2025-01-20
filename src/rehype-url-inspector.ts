import { Processor, Transformer } from "unified";
import { Node, Parent } from "unist";
import { VFile } from "vfile";
import { findUrls } from "./find-urls";
import { NormalizedOptions, Options } from "./options";
import { HtmlElementNode, UrlMatch } from "./types";

/**
 * This is a rehype plugin to validate and rewrite URLs anywhere in an HTML document.
 */
export function inspectUrls(this: Processor, opts?: Options): Transformer {
  const options = new NormalizedOptions(opts);

  return function transformer(root: Node, file: VFile): Node {
    const { inspect, inspectEach } = options;
    const urls: UrlMatch[] = [];
    let keepGoing: unknown;

    for (const node of crawl(root)) {
      for (const url of findUrls({ node, root, file }, options)) {
        if (inspectEach) {
          keepGoing = inspectEach(url);

          if (keepGoing !== undefined && !keepGoing) {
            // Stop crawling and immediately return
            return root;
          }
        }

        urls.push(url);
      }
    }

    if (inspect) {
      inspect(urls);
    }

    return root;
  };
}

/**
 * Crawls all descendant nodes and returns each one that matches one of the specified tag names.
 */
export function *crawl(node: Node | Parent): IterableIterator<HtmlElementNode> {
  if (node.type === "element") {
    yield node as HtmlElementNode;
  }

  if ('children' in node && node.children) {
    for (const child of (node as Parent).children) {
      yield *crawl(child);
    }
  }
}
