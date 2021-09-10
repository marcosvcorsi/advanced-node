export namespace UUIDGenerator {
  export type Params = {
    key: string
  }

  export type Result = string;
}

export interface UUIDGenerator {
  generate: (params: UUIDGenerator.Params) => UUIDGenerator.Result;
}
