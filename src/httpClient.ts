import Agentkeepalive from "agentkeepalive";
import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from "axios";

export class HttpClient {
  private readonly client: AxiosInstance;
  constructor(baseUrl: string, defaultHeaders?: any) {
    const keepAliveAgent = new Agentkeepalive({
      maxSockets: 1000,
      maxFreeSockets: 100,
      timeout: 60000,
      freeSocketTimeout: 30000, // free socket keepalive for 30 seconds
    });
    const sslKeepAliveAgent = new Agentkeepalive.HttpsAgent({
      maxSockets: 1000,
      maxFreeSockets: 100,
      timeout: 60000,
      freeSocketTimeout: 3000,
    });
    this.client = axios.create({
      httpAgent: keepAliveAgent,
      httpsAgent: sslKeepAliveAgent,
      baseURL: baseUrl,
      headers: defaultHeaders,
      validateStatus: this.validateStatusCode,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 1000 * 60 * 1, // one minute,
    });
  }

  get<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.client.get(url, config);
  }
  delete<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.client.delete(url, config);
  }
  head<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.client.head(url, config);
  }
  options<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.client.options(url, config);
  }
  post<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.client.post(url, data, config);
  }
  put<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.client.put(url, data, config);
  }

  private validateStatusCode(statusCode: number): boolean {
    return statusCode === 404 || (statusCode >= 200 && statusCode < 300);
  }
}
