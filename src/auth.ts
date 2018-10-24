import * as buffer from "buffer";
import { Const } from "./core/common";

import HttpRequest, { IErrorResponse, IHTTPRequestCallback, IHTTPRequestOptions } from "./core/HttpRequest";

const Buffer = buffer.Buffer;

export interface IAuthResponse extends IErrorResponse {
  access_token: string;
  token_type: string;
  uid: number;
  account_id: string;
}

export interface IAuthData {
  code: string;
  grant_type: string;
}

export function authenticate(
  code: string,
  callback: IHTTPRequestCallback<IAuthResponse>
) {
  const url: string = `${Const.dropbox.apiBaseUrl}/oauth2/token?code=${code}&grant_type=authorization_code`;
  
  const base64 = new Buffer(`${this.appKey}:${this.appSecret}`).toString("base64");
  const headers: Map<string, string> = new Map();
  headers.set("Authorization", `Basic ${base64}`);

  const requestBody: string = JSON.stringify({
    code,
    grant_type: "authorization_code"
  } as IAuthData);

  const options: IHTTPRequestOptions = { url, headers, requestBody };

  HttpRequest.post<IAuthResponse>(options, callback);
}
