export class AccessToken {
  static EXPIRATION_IN_MINUTES = 30;

  static get expirationInMs(): number {
    return AccessToken.EXPIRATION_IN_MINUTES * 60 * 1000;
  }
}
