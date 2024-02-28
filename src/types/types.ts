export type SuccessfulServerActionResponse<ResponseData> = {
  success: true;
  data?: ResponseData;
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
  };

export type ServerActionResponse<
  Input extends Record<string, any> = {},
  ResponseData = {}
> =
  | SuccessfulServerActionResponse<ResponseData>
  | FailedServerActionResponse<Input>;
