export class AccessToken {
  static EXPIRATION_IN_MINUTES = 30;

  constructor(
    readonly value: string,
  ) {}

  static get expirationInMs(): number {
    return AccessToken.EXPIRATION_IN_MINUTES * 60 * 1000;
  }
}
