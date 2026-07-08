import { Injectable, Inject, InjectionToken, Optional } from "@angular/core";
import { Observable, BehaviorSubject } from 'rxjs';
import * as _ from 'lodash-es';
import { ShTranslateService } from '../../../i18n';

export const CAEP_LANGUAGE_KEY_TOKEN = new InjectionToken<string>('Language key for language objects');

@Injectable({
    providedIn: 'root'
})
export class CaepPopoverService<T = any> {

    private _langs$ = new BehaviorSubject<T[]>([]);
    public langs$: Observable<T[]> = this._langs$.asObservable();

    constructor(private _translateService: ShTranslateService, @Optional()@Inject(CAEP_LANGUAGE_KEY_TOKEN) private _languageKey: string) { }

    public addLangs(langs: T[]) {
        const newLangs = _.unionBy(this._langs$.value, langs, lang => this._languageKey ? lang[this._languageKey] : lang);
        this._langs$.next(newLangs);
    }

    public removeLangs(langs: T[]) {
        const currentLangs = _.clone(this._langs$.value);
        _.remove(currentLangs, lang => this._languageKey ? langs.includes(lang) && !this._translateService.langs.includes(lang[this._languageKey]) : langs.includes(lang) && !this._translateService.langs.includes(lang as any));
        this._langs$.next(currentLangs);
    }

}