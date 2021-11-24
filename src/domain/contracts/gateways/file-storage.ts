export namespace UploadFile {
  export type Params = {
    file: Buffer;
    filename: string;
  }

  export type Result = Promise<string>;
}

export interface UploadFile {
  upload: (input: UploadFile.Params) => UploadFile.Result;
}

export namespace DeleteFile {
  export type Params = {
    filename: string;
  }

  export type Result = Promise<void>;
}

export interface DeleteFile {
  delete: (input: DeleteFile.Params) => DeleteFile.Result;
}
