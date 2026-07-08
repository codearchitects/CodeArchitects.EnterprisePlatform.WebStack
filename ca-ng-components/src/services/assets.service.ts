import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { dictionary } from '../utilities';
import { share } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {

  private _cache: dictionary<any> = {};

  constructor(private _http: HttpClient) { }

  public async get<TType>(filePath: string, cache = false) {
    return new Promise<TType>((resolve, reject) => {
      const request = this._http.get(`assets/${filePath}`);
      if (cache) {
        if (this._cache[filePath]) {
          resolve(this._cache[filePath]);
        } else {
          request.pipe(share({ connector: () => new ReplaySubject(1), resetOnError: false, resetOnComplete: false, resetOnRefCountZero: false }))
            .subscribe({ next: (r: TType) => {
              this._cache[filePath] = r;
              resolve(r);
            }, error: e => reject(e)});
        }
      } else {
        request.subscribe({ next: r => resolve(r as TType), error: e => reject(e)});
      }
    });
  }
}
