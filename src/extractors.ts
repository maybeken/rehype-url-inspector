import urlRegex from "url-regex-safe";
import { NodeInfo, UrlExtractor } from "./types";

/**
 * The default URL extractors
 */
export const defaultExtractors: UrlExtractor[] = [
  jsonUrls,
  styleUrls,
];

/**
 * Matches all URLs in a string
 */
const urlsPattern = urlRegex();

/**
 * Matches CSS URLs - including absolute and relative URLs
 */
const cssUrlPattern = /url\(["']?(.*?)["']?\)/ig;

/**
 * Finds URLs in JSON `<script>` tags
 *
 * @example
 *   <script type="application/json">
 *   <script type="application/ld+json">
 */
function jsonUrls({ node }: NodeInfo): string[] | undefined {
  if (node.tagName === "script"                     // Must be a <script> tag
    && node.properties                              // Must have attributes
    && !node.properties.src                         // Ignore external scripts. We only want inline scripts.
    && typeof node.properties.type === "string"     // Must have a "type" attribute
    && node.properties.type.includes("json")        // The "type" must contain "json"
    && node.children                                // Must have contents
    && node.children.length === 1                   // Must only have a single child
    && node.children[0].type === "text"             // The child must be a text node
  ) {
    const json = node.children[0].data as string;
    const urls = [];
    let match;

    while ((match = urlsPattern.exec(json)) !== null) {
      const url = match[0];
      urls.push(url);
    }

    return urls;
  }
}

/**
 * Finds URLs in inline `<style>` tags
 *
 * @example
 *   <style>
 *      div {
 *        background-image: url(/img/logo.png);
 *        content: url("http://example.com/img/logo.png")
 *      }
 *   </style>
 */
function styleUrls({ node }: NodeInfo): string[] | undefined {
  if (node.tagName === "style"                      // Must be a <style> tag
    && node.children                                // Must have contents
    && node.children.length === 1                   // Must only have a single child
    && node.children[0].type === "text"             // The child must be a text node
  ) {
    const css = node.children[0].data as string;
    const urls = [];
    let match;

    while ((match = cssUrlPattern.exec(css)) !== null) {
      const url = match[1];
      urls.push(url);
    }

    return urls;
  }
}
