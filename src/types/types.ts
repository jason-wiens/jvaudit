export type SuccessfulServerActionResponse<ResponseData> = {
  success: true;
  data?: ResponseData;
  formErrors?: never;
  message?: never;
};

export type FormError<T extends Record<string, any> = {}> = {
  field: keyof T;
  message: string;
};

export type FailedServerActionResponse<Input extends Record<string, any> = {}> =
  {
    success: false;
    formErrors?: FormError<Input>[];
    message?: string;
    data?: never;
  };

export type ServerActionResponse<
  Input extends Record<string, any> = {},
  ResponseData = void
> =
  | SuccessfulServerActionResponse<ResponseData>
  | FailedServerActionResponse<Input>;

export type ActionCallbacks = {
  onSuccess?: () => void;
  onError?: () => void;
  onSubmit?: () => void;
};

export type SuccessfulFetchResponse<Data> = {
  success: true;
  data: Data;
  error?: never;
};

export type FailedFetchResponse = {
  success: false;
  data?: never;
  error: {
    unauthorized: boolean;
    message: string;
  };
};

export type FetchResponse<Data> =
  | SuccessfulFetchResponse<Data>
  | FailedFetchResponse;
