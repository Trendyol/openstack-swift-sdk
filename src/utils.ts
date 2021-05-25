import { fromStream, FileTypeResult } from "file-type";
import { Readable as ReadableStream } from "stream";

export function detectMimeTypeFromStream(
  stream: ReadableStream
): Promise<FileTypeResult | undefined> {
  return fromStream(stream);
}

function DefaultUndefinedValueFilter(val: any, type: string): boolean {
  return type !== "undefined";
}

export class UrlBuilder {
  private queryStrings = new Map<string, string>();
  constructor(private basePath: string) {}

  addQueryString(q: string, v: any): UrlBuilder {
    this.queryStrings.set(q, v);
    return this;
  }
  addQueryStringIf(
    q: string,
    v: any,
    condition: (val: any, type: string) => boolean = DefaultUndefinedValueFilter
  ): UrlBuilder {
    if (condition && condition(v, typeof v) === false) {
      return this;
    }
    this.queryStrings.set(q, v);
    return this;
  }
  build(): string {
    const url = `${this.basePath}`;
    let query = "";
    let first = true;
    this.queryStrings.forEach((v, k) => {
      if (first) {
        query = `?${k}=${v}`;
        first = false;
      } else {
        query = `${query}&${k}=${v}`;
      }
    });
    return url + query;
  }
}
