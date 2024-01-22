import { SwiftClientConfiguration } from "./swiftClientConfiguration";
import { AuthService } from "./authService";
import { HttpClient } from "./httpClient";
import {
  ContainerMetaResponse,
  DownloadResponse,
  HeaderKeyValueArray,
  HeadersObject,
  ListObjectResponse,
  NotFound,
  ObjectMetaResponse,
  UploadOptions,
  UploadResponse,
} from "./types";
import { UrlBuilder } from "./utils";
import { Readable as ReadableStream } from "stream";

export class SwiftClient {
  private authService: AuthService;
  private readonly client: HttpClient;

  constructor(private configuration: SwiftClientConfiguration) {
    this.authService = new AuthService(configuration);
    this.client = new HttpClient(configuration.swiftEndpoint);
  }

  private async buildHeaders(headers: any = {}): Promise<any> {
    const token = await this.authService.getToken();
    return {
      ...token.getAsHeader(),
      ...headers,
    };
  }

  public async download(
    container: string,
    path: string
  ): Promise<NotFound | DownloadResponse> {
    const headers = await this.buildHeaders();
    const fullPath = this.buildFullPath(container, path);
    const response = await this.client.get(fullPath, {
      responseType: "stream",
      headers,
    });
    if (response.status === 404) {
      return new NotFound();
    }
    return new DownloadResponse(
      this.convertHeaderObjectToArray(response.headers as HeadersObject),
      response.data
    );
  }

  private buildFullPath(container: string, path: string): string {
    return encodeURIComponent(`${container}/${path}`);
  }

  public async getContainerMetadata(
    container: string
  ): Promise<NotFound | ContainerMetaResponse> {
    const headers = await this.buildHeaders();
    const response = await this.client.head(container, {
      headers,
    });
    if (response.status === 404) {
      return new NotFound();
    }
    const responseHeaders = response.headers;
    return new ContainerMetaResponse({
      headers: this.convertHeaderObjectToArray(
        response.headers as HeadersObject
      ),
      size: responseHeaders["content-length"],
      lastModified: responseHeaders["last-modified"],
    });
  }

  public async getMetadata(
    container: string,
    path: string
  ): Promise<NotFound | ObjectMetaResponse> {
    const headers = await this.buildHeaders();
    const fullPath = this.buildFullPath(container, path);
    const response = await this.client.head(fullPath, {
      headers,
    });
    if (response.status === 404) {
      return new NotFound();
    }
    const responseHeaders = response.headers;
    return new ObjectMetaResponse({
      fullPath: fullPath,
      headers: this.convertHeaderObjectToArray(
        response.headers as HeadersObject
      ),
      size: responseHeaders["content-length"],
      lastModified: responseHeaders["last-modified"],
      contentType: responseHeaders["content-type"],
      createdAt: responseHeaders["x-timestamp"],
      deleteAt: responseHeaders["x-delete-at"],
    });
  }

  public async list(
    container: string,
    prefix: string,
    limit: number,
    after?: string
  ): Promise<ListObjectResponse[]> {
    const headers = await this.buildHeaders();
    const url = new UrlBuilder(container)
      .addQueryString("format", "json")
      .addQueryStringIf("prefix", encodeURIComponent(prefix))
      .addQueryString("limit", limit)
      .addQueryStringIf("after", after ? encodeURIComponent(after) : null)
      .build();
    const response = await this.client.get(url, {
      headers,
    });
    const result = (response.data as any[]).map(
      (f) =>
        new ListObjectResponse({
          bytes: f.bytes,
          contentType: f["content_type"],
          hash: f.hash,
          lastModified: f["last_modified"],
          name: f.name,
        })
    );
    return result;
  }

  public async upload(
    container: string,
    path: string,
    stream: ReadableStream,
    options?: UploadOptions
  ): Promise<UploadResponse> {
    options = new UploadOptions(options);
    const objectHeaders = options.headers;

    if (options.ttl) {
      objectHeaders["x-delete-after"] = options.ttl.toString();
    }

    const mimetype = options.mimetype || "";

    const headers = await this.buildHeaders({
      ...objectHeaders,
      "Content-Type": mimetype,
    });
    if (!container) {
      throw new Error("available container not found!");
    }
    const fullPath = this.buildFullPath(container, path);

    await this.client.put(fullPath, stream, {
      headers,
    });
    return new UploadResponse(fullPath);
  }

  public async copy(
    container: string,
    path: string,
    destinationContainer: string,
    destinationPath: string
  ): Promise<boolean> {
    if (!container) {
      throw new Error("available container not found!");
    }

    const headers = await this.buildHeaders({
      "X-Copy-From": "/" + container + "/" + path,
      "Content-Length": 0,
    });

    const fullPath = this.buildFullPath(destinationContainer, destinationPath);

    await this.client.put(fullPath, "", {
      headers,
    });

    return true;
  }

  public async delete(container: string, path: string): Promise<boolean> {
    const headers = await this.buildHeaders();

    if (!container) {
      throw new Error("available container not found!");
    }
    const fullPath = this.buildFullPath(container, path);
    await this.client.delete(fullPath, { headers });
    return true;
  }

  private convertHeaderObjectToArray(
    headers: HeadersObject,
    filter: ((key: string, value: string) => boolean) | undefined = undefined
  ): HeaderKeyValueArray {
    const newHeaders: any = [];
    for (const key in Object.keys(headers)) {
      const val = headers[key];
      if (filter && !filter(key, val)) {
        continue;
      }
      newHeaders.push({
        key: key,
        value: val,
      });
    }
    return newHeaders;
  }
}
