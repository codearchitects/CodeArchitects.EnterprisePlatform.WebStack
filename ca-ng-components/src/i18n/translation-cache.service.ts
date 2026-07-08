import { Injectable } from '@angular/core';
import { dictionary } from '../utilities';
import { Observable, ReplaySubject } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { share } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CaepTranslationCacheService {

    private _translationRequestsCache: dictionary<Observable<HttpEvent<any>>> = {};

    public setTranslationCache(path: string, translationRequest: Observable<HttpEvent<any>>) {
        this._translationRequestsCache[path] = translationRequest ? translationRequest.pipe(share({ connector: () => new ReplaySubject(1), resetOnError: false, resetOnComplete: false, resetOnRefCountZero: false })) : translationRequest;
    }

    public getTranslationCache(path: string) {
        return this._translationRequestsCache[path];
    }
    
}

