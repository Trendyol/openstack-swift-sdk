export class Token {
  private readonly expireAtMillisecond: number;

  constructor(
    private readonly token: string,
    private readonly expiresAt: Date
  ) {
    this.expireAtMillisecond = expiresAt.getTime() - 10000; // 10 second
  }

  public isExpired(): boolean {
    const now = Date.now();
    if (now >= this.expireAtMillisecond) {
      return true;
    }
    return false;
  }

  public getAsHeader(): any {
    if (this.isExpired()) {
      throw new Error("token expired!");
    }
    return {
      "X-Auth-Token": this.token,
    };
  }

  public toString = (): string => {
    if (this.isExpired()) {
      throw new Error("token expired!");
    }
    return this.token;
  };
}
