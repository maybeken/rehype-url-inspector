import { unified } from "unified"
import parse from 'rehype-parse'
import stringify from 'rehype-stringify'
import { read } from 'to-vfile'
import inspectUrls from '../../lib/index.js'

/**
 * Processes the given HTML file using Rehype and the inspectUrls plugin
 */
export default async function process (filePath, options = {}) {
  let processor = unified()
    .use(parse)
    .use(inspectUrls, options)
    .use(stringify);

  let file = await read(filePath);
  return processor.process(file);
}
