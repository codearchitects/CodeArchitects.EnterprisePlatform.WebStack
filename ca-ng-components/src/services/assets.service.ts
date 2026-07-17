import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { dictionary } from 'src/utilities';
import { publishReplay, refCount } from 'rxjs/operators';

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
          request.pipe(publishReplay(1), refCount())
            .subscribe((r: TType) => {
              this._cache[filePath] = r;
              resolve(r);
            });
        }
      } else {
        request.subscribe(r => resolve(r as TType));
      }
    });
  }
}
