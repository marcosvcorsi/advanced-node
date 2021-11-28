class PgConnection {
  private static instance?: PgConnection;

  private constructor() {}

  static getInstance(): PgConnection {
    if (!PgConnection.instance) {
      PgConnection.instance = new PgConnection();
    }

    return PgConnection.instance;
  }
}

describe('PgConnection', () => {
  it('should be a singleton', () => {
    const sut = PgConnection.getInstance();
    const newInstance = PgConnection.getInstance();

    expect(sut).toBe(newInstance);
  });
});
