// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface GeneralServiceResponse {
  status: boolean;
  message: string;
}

export interface fileType {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}
