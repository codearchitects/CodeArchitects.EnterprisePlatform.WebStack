import { Observable } from 'rxjs';
import { HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';

export type IShHttpResponseType = 'json' | 'blob' | 'text' | 'arraybuffer';


export interface IShHttpRequestOptions {
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  observe?: 'body';
  params?: HttpParams | {
    [param: string]: string | string[];
  };
  responseType?: 'json';
  reportProgress?: boolean;
  withCredentials?: boolean;
}

export interface IShHttpRequestBodyOptions<TBody> extends IShHttpRequestOptions {
  body?: TBody;
}

export abstract class ShHttp {
  abstract request<TBody, TResponse>(method: string, url: string, options?: IShHttpRequestBodyOptions<TBody>): Observable<HttpResponse<TResponse>>;
  abstract get<TResponse>(url: string, options?: IShHttpRequestOptions): Observable<HttpResponse<TResponse>>;
  abstract post<TBody, TResponse>(url: string, body: TBody, options?: IShHttpRequestOptions): Observable<HttpResponse<TResponse>>;
  abstract put<TBody, TResponse>(url: string, body: TBody, options?: IShHttpRequestOptions): Observable<HttpResponse<TResponse>>;
  abstract delete<TResponse>(url: string, options?: IShHttpRequestOptions): Observable<HttpResponse<TResponse>>;
  abstract patch<TBody, TResponse>(url: string, body: TBody, options?: IShHttpRequestOptions): Observable<HttpResponse<TResponse>>;
  abstract head<TResponse>(url: string, options?: IShHttpRequestOptions): Observable<HttpResponse<TResponse>>;
  abstract options<TResponse>(url: string, options?: IShHttpRequestOptions): Observable<HttpResponse<TResponse>>;
}
