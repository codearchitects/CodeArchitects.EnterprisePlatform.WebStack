
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { DEFAULT_LANGUAGE, MissingTranslationHandler, TranslateCompiler, TranslateLoader, TranslateParser, TranslateService, TranslateStore, USE_DEFAULT_LANG, USE_EXTEND, USE_STORE } from '@ngx-translate/core';
import { SH_TRANSLATE_PREFIX } from './translate-prefix.token';
import { Observable, of, Subject } from 'rxjs';
import { map, shareReplay, take, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash-es';

export enum CaepTranslationMergeMode {
    CURRENT,
    REMOTE
}

@Injectable()
export class ShTranslateService extends TranslateService implements OnDestroy {

    private _remoteTranslations: { [key: string]: { [key: string]: any } } = {};
    private _destroy$ = new Subject<void>();

    constructor(store: TranslateStore,
                currentLoader: TranslateLoader,
                compiler: TranslateCompiler,
                parser: TranslateParser,
                missingTranslationHandler: MissingTranslationHandler,
                @Inject(USE_DEFAULT_LANG) useDefaultLang: boolean = true,
                @Inject(USE_STORE) isolate: boolean = false,
                @Inject(USE_EXTEND) extend: boolean = false,
                @Inject(DEFAULT_LANGUAGE) defaultLanguage: string,
                @Inject(SH_TRANSLATE_PREFIX) private translatePrefix: string = '') {
        super(store, currentLoader, compiler, parser, missingTranslationHandler, useDefaultLang, isolate, extend, defaultLanguage);
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

    /**
     * Gets an object of translations for a given language with the current loader
     * and passes it through the compiler
     */
    public getTranslation(lang: string): Observable<any> {
        this['pending'] = true;
        const loadingTranslations = this.currentLoader.getTranslation(lang).pipe(
            map((res: Object) => {
                if(this.translatePrefix === '') {
                    return res ?? {};
                }
                const wrappedTranslations = { [this.translatePrefix]: res ?? {} };
                return wrappedTranslations;
            }),
            map((res: Object) => {
                if(this._remoteTranslations[lang]) {
                    Object.keys(this._remoteTranslations[lang]).forEach((remote) => {
                        if(this.translatePrefix !== '') {
                            res[this.translatePrefix][remote] = _.merge({}, res[this.translatePrefix][remote], this._remoteTranslations[lang][remote]);
                        } else {
                            res[remote] = _.merge({}, res[remote], this._remoteTranslations[lang][remote]);
                        }
                    });
                    return res;
                } else
                    return res;
            }),
            shareReplay(1),
            take(1),
            takeUntil(this._destroy$)
        );

        this['loadingTranslations'] = loadingTranslations.pipe(
            map((res: Object) => this.compiler.compileTranslations(res, lang)),
            shareReplay(1),
            take(1),
            takeUntil(this._destroy$)
        );

        this['loadingTranslations'].pipe(takeUntil(this._destroy$)).subscribe({
            next: (res: Object) => {
                this.translations[lang] = this['extend'] && this.translations[lang] ? { ...res, ...this.translations[lang] } : res;
                this['updateLangs']();
                this['pending'] = false;
                this.onTranslationChange.emit({lang: lang, translations: this.translations[lang]});
            },
            error: (err: any) => {
                this['pending'] = false;
            }
        });
        return loadingTranslations;
    }

    public use(lang: string): Observable<any> {
        // don't change the language if the language given is already selected
        if (lang === this.currentLang) {
            return of(this.translations[lang]);
        }
    
        let pending = this['retrieveTranslations'](lang);
    
        if (typeof pending !== "undefined") {
            // do not set currentLang immediately (necessary for microfrontend architecture)
            // if (!this.currentLang) {
            //     this.currentLang = lang;
            // }
    
            pending.pipe(take(1))
                .subscribe((res: any) => {
                    this['changeLang'](lang);
                });
        
            return pending;
        } else { // we have this language, return an Observable
          this['changeLang'](lang);
    
          return of(this.translations[lang]);
        }
    }

    public getParsedResult(translations: any, key: any, interpolateParams?: Object): any {
        const translateKey = this.getKeyWithPrefix(key);
        const result = super.getParsedResult(translations, translateKey, interpolateParams);
        if(typeof result === 'string') {
            return this.translatePrefix !== '' ? ( result.startsWith(this.translatePrefix + '.') ? key : result ) : result;
        } else if(result.subscribe) {
            return result.pipe(map((translation: any) => {
                if(typeof(translation) === 'string')
                    return this.translatePrefix !== '' ? ( translation.startsWith(this.translatePrefix + '.') ? key : translation ) : translation;
                else
                    return translation;
            }));
        } else
            return result;
    }

    public set(key: string, value: string, lang: string = this.currentLang): void {
        if(this.translatePrefix !== '') {
            const wrappedTranslation = { [this.translatePrefix]: { [key]: value } };
            return super.setTranslation(lang, wrappedTranslation, true);
        } else {
            return super.set(key, value, lang);
        }
    }

    public setTranslation(lang: string, translations: Object, shouldMerge: boolean = false): void {
        let newTranslations: Object;
        if(this.translatePrefix !== '') {
            const keys = Object.keys(translations);
            if(keys.length === 1 && keys[0] === this.translatePrefix)
                newTranslations = translations;
            else
                newTranslations = { [this.translatePrefix]: translations };
        } else {
            newTranslations = translations;
        }
        return super.setTranslation(lang, newTranslations, shouldMerge);
    }

    /**
     * Manually sets an object of translations for a given language
     * after passing it through the compiler and saving it into remote translations map.
     * 
     * @param lang language
     * @param translations translations object whose keys are remote names
     * @param shouldMerge should merge with current translations @default false
     * @param mergeMode priority to the current saved remote translations or to the passed remote translations @default CaepTranslationMergeMode.CURRENT
     * @returns 
     */
    public setRemoteTranslation(lang: string, translations: Object, shouldMerge: boolean = false, mergeMode: CaepTranslationMergeMode = CaepTranslationMergeMode.CURRENT): void { //?
        const newTranslations = {};
        const remotes = Object.keys(translations);
        remotes.forEach((remoteName) => {
            let mergedRemoteTranslations: Object;
            switch(mergeMode) {
                case CaepTranslationMergeMode.CURRENT:
                    mergedRemoteTranslations = _.merge({}, translations[remoteName], this.translatePrefix !== '' ?  { ...this.translations[lang][this.translatePrefix][remoteName] } : { ...this.translations[lang][remoteName] });
                    break;
                case CaepTranslationMergeMode.REMOTE:
                    mergedRemoteTranslations = _.cloneDeep(translations[remoteName]);
                    break;
                default:
                    break;
            }
            newTranslations[remoteName] = mergedRemoteTranslations;
        });
        this._remoteTranslations[lang] = { ...this._remoteTranslations[lang], ...newTranslations };
        return this.setTranslation(lang, newTranslations, shouldMerge);
    }

    public resetRemoteTranslation(lang?: string): void {
        if(lang) {
            this._remoteTranslations[lang] = undefined;
        } else {
            Object.keys(this._remoteTranslations).forEach(lang => this._remoteTranslations[lang] = undefined);
        }
    }

    private getKeyWithPrefix(key: string | Array<string>): string | Array<string> {
        if(this.translatePrefix === '') {
            return key;
        }
        let translateKey: string | Array<string>;
        if(Array.isArray(key)) {
            translateKey = [ ...key ];
            for(let k of translateKey) {
                if(!k.startsWith(this.translatePrefix + '.'))
                    k = this.translatePrefix + '.' + k;
            }
        } else {
            translateKey = key;
            if(!translateKey.startsWith(this.translatePrefix + '.'))
                translateKey = this.translatePrefix + '.' + translateKey;
        }
        return translateKey;
    }

}