import { Stream } from "stream";
import { Readable as ReadableStream } from "stream";

export type HeaderKeyValueArray = { key: string; value: string }[];
export type HeadersObject = { [key: string]: string };

export class DownloadResponse {
  constructor(
    public readonly headers: HeaderKeyValueArray,
    public readonly data: Stream
  ) {}
}

export class ContainerMetaResponse {
  headers: HeaderKeyValueArray;
  size: number;
  lastModified: string;
  constructor(init?: Partial<ContainerMetaResponse>) {
    Object.assign(this, init);
  }
}

export class ObjectMetaResponse {
  fullPath: string;
  headers: HeaderKeyValueArray;
  size: number;
  lastModified: string;
  contentType: string;
  createdAt: number;
  deleteAt: number;
  constructor(init?: Partial<ObjectMetaResponse>) {
    Object.assign(this, init);
  }
}
export class ListObjectResponse {
  name: string;
  hash: string;
  bytes: number;
  contentType: string;
  lastModified: string;
  constructor(init?: Partial<ListObjectResponse>) {
    Object.assign(this, init);
  }
}

export class NotFound {
  found: boolean;
}
export class UploadOptions {
  encoding: string;
  mimetype: string;
  originalName: string;
  size: number;
  headers: HeadersObject;
  ttl: number;
  tempExpire: number;
  constructor(init?: Partial<UploadOptions>) {
    Object.assign(this, init);
  }
}

export class UploadResponse {
  constructor(public readonly fullPath: string) {}
}
