import { authenticate, IAuthResponse } from "./src/auth";
import { revoke } from "./src/revoke";

import { IHTTPRequestCallback } from "./src/core/HttpRequest";

export interface IDropboxProto {
  authenticate(code:string, callback: IHTTPRequestCallback<IAuthResponse>);
  revoke(token: string, callback: IHTTPRequestCallback<void>);
}

export interface IDropboxContructor extends ObjectConstructor {
  prototype: IDropboxProto;
}

export interface IDropbox extends IDropboxContructor, IDropboxProto {
  appKey: string;
  appSecret: string;
}

const DropboxConstructor = function(this: IDropbox, appKey: string, appSecret: string) {
  this.appKey = appKey;
  this.appSecret = appSecret;
} as IDropboxContructor;

DropboxConstructor.prototype.authenticate = authenticate;
DropboxConstructor.prototype.revoke = revoke;

export const Dropbox = DropboxConstructor as any as { new (appKey: string, appSecret: string): IDropbox; };