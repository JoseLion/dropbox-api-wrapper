import * as xmlhttprequest from "xmlhttprequest";

const XMLHttpRequest = xmlhttprequest.XMLHttpRequest;

export interface IHTTPRequestOptions {
  url: string;
  requestBody?: Document | BodyInit;
  headers?: Map<string, string>;
}

export interface IHTTPResponse<T> {
  status?: number;
  statusText?: string;
  body?: T;
}

export interface IErrorResponse {
  status?: number;
  message?: string;
  error?: any;
}

export type IHTTPRequestCallback<T> =
  (error: Error, response?: IHTTPResponse<T>, event?: Event) => void;

export default {
  get<T>(
    options: IHTTPRequestOptions,
    callback: IHTTPRequestCallback<T | IErrorResponse>
  ): XMLHttpRequest {
    const request: XMLHttpRequest = new XMLHttpRequest();

    request.open("GET", options.url);
    setAllHeaders(request, options.headers);
    request.send();

    setEventHandlers<T>(request, callback);
    return request;
  },

  post<T>(
    options: IHTTPRequestOptions,
    callback: IHTTPRequestCallback<T | IErrorResponse>
  ): XMLHttpRequest {
    const request: XMLHttpRequest = new XMLHttpRequest();

    request.open("POST", options.url);
    setAllHeaders(request, options.headers);

    if (options.requestBody) {
      request.send(options.requestBody);
    } else {
      request.send();
    }

    setEventHandlers<T>(request, callback);
    return request;
  }
};

function setAllHeaders(request: XMLHttpRequest, headers: Map<string, string>) {
  if (headers) {
    headers.forEach((value, name) => {
      request.setRequestHeader(name, value);
    });
  }
}

function setEventHandlers<T>(
  request: XMLHttpRequest,
  callback: IHTTPRequestCallback<T | IErrorResponse>
): void {
  request.onloadend = function(event: Event) {
    const contentType: string = this.getResponseHeader("content-type") || "";

    if (!contentType.includes("application/json") && !contentType.includes("text/javascript")) {
      const errorResponse: IErrorResponse = {
        error: `Response is not JSON, response: ${this.responseText}`,
        message: "Response is not a JSON objects",
        status: 500
      };

      callback(new Error(errorResponse.message), errorResponse, event);
      return;
    }

    if (this.status >= 200 && this.status < 300) {
      const response: IHTTPResponse<T> = {
        body: JSON.parse(request.responseText),
        status: this.status,
        statusText: this.statusText
      };

      callback(null, response, event);
      return;
    }

    const error: IErrorResponse = toErrorResponse(this.responseText, this.status);
    callback(new Error(error.message || error.error), error, event);
  };

  request.onerror = function(event: Event) {
    const error: IErrorResponse = toErrorResponse(this.responseText, this.status);
    callback(new Error(error.message || error.error), error, event);
  };
}

function toErrorResponse(responseText: string, status: number): IErrorResponse {
  try {
    const json = JSON.parse(responseText);

    return {
      error: json.error,
      message: json.error_summary,
      status
    };
  } catch (error) {
    return {
      error: responseText,
      message: responseText,
      status
    };
  }
}
