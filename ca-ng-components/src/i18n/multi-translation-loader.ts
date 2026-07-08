import { HttpClient } from "@angular/common/http";
import { TranslateLoader } from "@ngx-translate/core";
import { forkJoin, Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import * as _ from 'lodash-es';

export interface ICaepTranslationResource {
    prefix: string;
    suffix: string;
}

export class CaepMultiTranslationHttpLoader implements TranslateLoader {

    constructor(private http: HttpClient, private resources: ICaepTranslationResource[]) { }

    public getTranslation(lang: string): Observable<any> {
        const requests = this.resources.map(resource => {
            const path = `${resource.prefix}${lang}${resource.suffix}`;
            return this.http.get(path).pipe(
                catchError(res => {
                    console.warn('Something went wrong with the following translation file:', path);
                    console.warn(res.message);
                    return of({});
                })
            );
        });
        return forkJoin(requests).pipe(map(response => _.merge({}, ...response)));
    }

}