export namespace UploadFile {
  export type Params = {
    file: Buffer;
    key: string;
  }

  export type Result = Promise<void>;
}

export interface UploadFile {
  upload: (input: UploadFile.Params) => UploadFile.Result;
}
