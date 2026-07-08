import { Injector } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataContextService } from '@ca-webstack/ng-data-context';
import { SerializerService } from '@ca-webstack/ng-serializer';
import { Activity } from './../components/activity';
import { ShHttp, IShHttpRequestOptions, IShHttpRequestBodyOptions } from './sh-http.service';
import { IActivityPayload } from '../types/index';
import { map } from 'rxjs/operators';

export interface IPayloadBrowse {
  id: string;
  taskName: string;
  taskPath: string;
  updateTimestamp: Date;
}

export interface TaskToClose {
  resourceName?: string;
  resourceId?: string;
  description?: string;
  success: boolean;
}

export abstract class BaseDelegates {

  activity: Activity<any>;
  http: ShHttp;
  serializer: SerializerService;
  dataContext: DataContextService;

  protected abstract readonly api: string;

  abstract getUniqueIdentifier(count: number): Observable<string>;
  abstract getLastPayloads<T extends IPayloadBrowse>(): Observable<T[]>;
  abstract getPayloadByTaskId<T extends IActivityPayload>(taskId: string): Observable<T>;
  abstract savePayload<T extends IActivityPayload>(payload: T): Observable<boolean>;
  abstract deletePayload(taskId: string): Observable<boolean>;
  abstract closeTask(taskToClose: TaskToClose): Observable<boolean>;

  public constructor(
    injector: Injector
  ) {
    this.http = injector.get(ShHttp);
    this.serializer = injector.get(SerializerService);
    this.dataContext = injector.get(DataContextService);
  }

  protected post<TResult>(resource: string, payload: any, disableContextAttach = false) {
    const url = this.api + resource;
    const body = this.serializer.serialize(payload);
    const options: IShHttpRequestOptions = { headers: { 'Content-Type': 'application/json' } };
    if (this.activity && this.activity.taskId) {
      options.headers = {
        'Content-Type': 'application/json',
        'Activity-TaskId': this.activity.taskId
      };
    }
    if (options) {
      options.observe = 'response' as 'body';
      options.responseType = 'text' as 'json';
    }
    let post: Observable<TResult> = this.http.post(url, body, options)
      .pipe(map(this.deserialize.bind(this)));
    if (!disableContextAttach) {
      post = post.pipe(map(this.attach.bind(this)));
    }
    return post;
  }

  protected request<TResponse>(method: 'DELETE' | 'GET' | 'HEAD' | 'JSONP' | 'OPTIONS' | 'POST' | 'PUT' | 'PATCH', resource: string, payload: any, disableContextAttach = false) {
    const url = this.api + resource;
    const options: IShHttpRequestBodyOptions<TResponse> = {};
    const serialized = this.serializer.serialize(payload);
    if (method.startsWith('P')) {
      options.headers = { 'Content-Type': 'application/json' };
      options.body = serialized;
    } else {
      options.params = { 'json': serialized };
    }
    if (this.activity && this.activity.taskId && method !== 'JSONP') {
      options.headers = {
        'Content-Type': 'application/json',
        'Activity-TaskId': this.activity.taskId
      };
    }
    if (options) {
      options.observe = 'response' as 'body';
      options.responseType = 'text' as 'json';
    }
    let request: Observable<TResponse> = this.http.request(method, url, options)
      .pipe(map(this.deserialize.bind(this)));
    if (!disableContextAttach) {
      request = request.pipe(map(this.attach.bind(this)));
    }
    return request;
  }


  protected deserialize(res: HttpResponse<string>) {
    return this.serializer.deserialize(res.body);
  }

  protected attach<T>(item: T) {
    return this.dataContext.attach(item);
  }
}
