import { HttpInterceptor, HttpEvent, HttpRequest, HttpResponse, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CaepTranslationCacheService } from './translation-cache.service';

@Injectable()
export class CaepTranslationHttpInterceptor implements HttpInterceptor {

    constructor(private _translationCacheService: CaepTranslationCacheService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if(/^\/*assets\/(?:[^\/]+\/)*i18n\/(?:.)+$/.test(req.url)) {
            const path = req.url.match(/assets\/(?:.+\/)*i18n\/(?:.)+$/)[0];
            const cachedTranslationRequest = this._translationCacheService.getTranslationCache(path);
            if (!cachedTranslationRequest) {
                const translationRequest = next.handle(req).pipe(catchError(stateEvent => {
                    this._translationCacheService.setTranslationCache(path, null);
                    throw stateEvent;
                }));
                this._translationCacheService.setTranslationCache(path, translationRequest);
                return this._translationCacheService.getTranslationCache(path);
            } else 
                return cachedTranslationRequest.pipe(map(stateEvent => stateEvent instanceof HttpResponse ? stateEvent.clone() : stateEvent ));
        }
        return next.handle(req);
    }

}