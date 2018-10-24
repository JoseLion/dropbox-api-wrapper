import HttpRequest, { IHTTPRequestCallback, IHTTPRequestOptions } from "./core/HttpRequest";
import { Const } from "./core/common";

export function revoke(
  token: string,
  callback: IHTTPRequestCallback<void>
) {
  const url: string = `${Const.dropbox.apiBaseUrl}/2/auth/token/revoke`;

  const headers: Map<string, string> = new Map();
  headers.set("Authorization", `Bearer ${token}`);

  const options: IHTTPRequestOptions = { url, headers };

  HttpRequest.post(options, callback);
}