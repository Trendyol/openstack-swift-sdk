import { Token } from "./token";
import { SwiftClientConfiguration } from "./swiftClientConfiguration";
import { HttpClient } from "./httpClient";

export class AuthService {
  private readonly client: HttpClient;
  private readonly payload: any;
  private currentToken: Token | undefined;

  constructor(private readonly configuration: SwiftClientConfiguration) {
    this.client = new HttpClient(configuration.authEndpoint);
    this.payload = {
      auth: {
        identity: {
          methods: ["application_credential"],
          application_credential: {
            id: this.configuration.credentialId,
            secret: this.configuration.secret,
          },
        },
      },
    };
  }

  public async getToken(): Promise<Token> {
    if (this.currentToken) {
      if (!this.currentToken.isExpired()) {
        return this.currentToken;
      }
    }

    const response = await this.client.post(
      "/v3/auth/tokens?noCatalog",
      this.payload
    );
    this.currentToken = new Token(
      response.headers["x-subject-token"],
      new Date(response.data.token.expires_at)
    );
    return this.currentToken;
  }
}
