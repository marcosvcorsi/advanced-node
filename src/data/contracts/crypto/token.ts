export interface TokenGenerator {
  generateToken: (params: TokenGenerator.Params) => Promise<TokenGenerator.Result>;
}

export namespace TokenGenerator {
  export type Params = {
    id: string
  }

  export type Result = string;
}
