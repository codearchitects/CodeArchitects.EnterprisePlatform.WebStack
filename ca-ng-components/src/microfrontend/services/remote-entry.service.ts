import { Injectable, inject } from '@angular/core';
import { Subject, concatMap, lastValueFrom, map, takeUntil } from 'rxjs';
import { ShTranslateService } from '../../i18n';
import { LocaleService } from '@ca-webstack/ng-i18n';
import { CaepEventManagerService } from '@ca-webstack/ng-event-manager';
import { CAEP_MICROFRONTEND_REMOTE_DICTIONARY_TOKEN } from '../tokens';
import { CAEP_MICROFRONTEND_REMOTE_TRANSLATIONS_LOAD_EVENT_NAME, CAEP_MICROFRONTEND_SHELL_DEFAULT_LANG_REQUEST_EVENT_NAME, getMfShellDefaultLangChangeEventName } from './util';
import { LangChangeEvent } from '@ngx-translate/core';

export interface ICaepRemoteEntryParams {
    appName: string;
}

@Injectable()
export class CaepRemoteEntryService<T = any> {

    /**
     * Subject which notifies subscribers when service destroys itself
     */
    private _destroy$ = new Subject<void>();
    /**
     * Langs whose translations have been communicated to the shell of multi-application architecture
     */
    private readonly _communicatedLangs: string[] = [];
    /**
     * TranslateService instance
     */
    private _translateService = inject(ShTranslateService);
    /**
     * LocaleService instance
     */
    private _localeService = inject(LocaleService);
    /**
     * EventManager instance
     */
    private _eventManager = inject(CaepEventManagerService);
    /**
     * Remote dictionary of multi-application architecture
     */
    private _remoteDictionary = inject(CAEP_MICROFRONTEND_REMOTE_DICTIONARY_TOKEN);
    /**
     * Name of the remote in the multi-application architecture
     */
    private _appName: string;
    /**
     * Event name of the shell's default lang change
     */
    private _shellDefaultLangChangeEventName: string;
    /**
     * Ng module instance
     */
    private _module: T;

    /**
     * Initializes multi-application management for the remote entry module
     * 
     * @param module ng module instance
     * @param params ICaepRemoteEntryParams parameters
     */
    public init(module: T, params: ICaepRemoteEntryParams): void {
        this._module = module;
        this._appName = params.appName;
        const flatCaseAppName = params.appName.split('-').join('');
        this._shellDefaultLangChangeEventName = getMfShellDefaultLangChangeEventName(flatCaseAppName);
        if(this._remoteDictionary[params.appName]) {
            console.error('Remote dictionary is not cleaned!');
        }
        this._remoteDictionary[params.appName] = this;
        this._eventManager.registerEventListener(this._shellDefaultLangChangeEventName, this.onShellDefaultLangChange, this);
        this.exposeTranslations();
    }

    /**
     * OnDestroy lifecycle hook
     */
    public onDestroy() {
        this._destroy$.next();
        this._destroy$.complete();
        this._eventManager.removeEventListener(this._shellDefaultLangChangeEventName, this.onShellDefaultLangChange);
    }

    /**
     * Shell's default lang change event handler
     * 
     * @param lang shell's default lang
     */
    private async onShellDefaultLangChange(lang: string) {
        if(lang !== this._translateService.defaultLang && lang !== this._translateService.currentLang && !this._translateService.translations[lang]) {
            const translations: any = {};
            const translation = await lastValueFrom(this._translateService['retrieveTranslations'](lang));
            translations[lang] = translation || {};
            this._eventManager.dispatch(CAEP_MICROFRONTEND_REMOTE_TRANSLATIONS_LOAD_EVENT_NAME, this._appName, translations);
            this._communicatedLangs.push(lang);
        }
    }

    /**
     * Syncs locales between shell and remotes, then passes translations to the shell
     */
    private exposeTranslations() {
        let firstLangLoading = true;
        this._translateService.onLangChange
            .pipe(takeUntil(this._destroy$))
            .subscribe((event: LangChangeEvent) => this._localeService.setLocale(event.lang));
        this._localeService
            .getLocale()
            .pipe(
                takeUntil(this._destroy$),
                concatMap((lang: string) => this._translateService.use(lang).pipe(map((translations: any) => {
                    return { lang, translations };
                    })
                ))
            ).subscribe((res) => {
                if(firstLangLoading) {
                    this.loadTranslations();
                    this._eventManager.dispatch(CAEP_MICROFRONTEND_SHELL_DEFAULT_LANG_REQUEST_EVENT_NAME, this._appName);
                    firstLangLoading = false;
                } else if(!this._communicatedLangs.includes(res.lang)) {
                    this._eventManager.dispatch(CAEP_MICROFRONTEND_REMOTE_TRANSLATIONS_LOAD_EVENT_NAME, this._appName, { [res.lang]: res.translations });
                    this._communicatedLangs.push(res.lang);
                }
            });
    }

    /**
     * Loads and communicates initial translations to the shell
     */
    private async loadTranslations() {
        const translations: any = {};
        const defaultLang = this._translateService.defaultLang;
        const currentLang = this._translateService.currentLang;
        if(defaultLang && defaultLang !== currentLang) {
            if(!this._translateService.translations[defaultLang]) {
                const translation = await lastValueFrom(this._translateService.getTranslation(defaultLang));
                translations[defaultLang] = translation || {};
            } else {
                translations[defaultLang] = this._translateService.translations[defaultLang];
            }
            this._communicatedLangs.push(defaultLang);
        }
        if(currentLang) {
            translations[currentLang] = this._translateService.translations[currentLang];
            this._communicatedLangs.push(currentLang);
        }
        this._eventManager.dispatch(CAEP_MICROFRONTEND_REMOTE_TRANSLATIONS_LOAD_EVENT_NAME, this._appName, translations);
    }
}