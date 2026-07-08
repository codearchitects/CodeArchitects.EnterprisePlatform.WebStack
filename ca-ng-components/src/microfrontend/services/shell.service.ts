import { Injectable, OnDestroy, inject } from '@angular/core';
import { CaepTranslationMergeMode, ShTranslateService } from '../../i18n';
import { Subject, lastValueFrom, take, takeUntil } from 'rxjs';
import { LocaleService } from '@ca-webstack/ng-i18n';
import { CaepEventManagerService } from '@caep/ng-event-manager';
import { CAEP_MICROFRONTEND_REMOTE_TRANSLATIONS_CHANGE_EVENT_NAME, CAEP_MICROFRONTEND_REMOTE_TRANSLATIONS_LOAD_EVENT_NAME, CAEP_MICROFRONTEND_SHELL_DEFAULT_LANG_REQUEST_EVENT_NAME, getMfShellDefaultLangChangeEventName } from './util';
import { LangChangeEvent } from '@ngx-translate/core';

export interface ICaepShellParams {
}

@Injectable()
export class CaepShellService<T = any> implements OnDestroy {

    /**
     * Subject which notifies subscribers when service destroys itself
     */
    private _destroy$ = new Subject<void>();
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
     * Component instance
     */
    private _component: T;

    /**
     * Initializes multi-application management for the shell's host component
     * 
     * @param component component instance
     * @param params ICaepShellParams params
     */
    public init(component: T, params?: ICaepShellParams): void {
        this._component = component;
        this._eventManager.registerEventListeners(component);
        this._eventManager.registerEventListener(CAEP_MICROFRONTEND_REMOTE_TRANSLATIONS_LOAD_EVENT_NAME, this.onRemoteTranslationsLoad, this); //registration is needed in component constructor to support remote preloading use-case
        this._eventManager.registerEventListener(CAEP_MICROFRONTEND_REMOTE_TRANSLATIONS_CHANGE_EVENT_NAME, this.onRemoteTranslationsChange, this);
        this._eventManager.registerEventListener(CAEP_MICROFRONTEND_SHELL_DEFAULT_LANG_REQUEST_EVENT_NAME, this.onDefaultLangRequest, this);
        this.syncLocales();
    }

    public ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
        this._eventManager.removeEventListeners(this._component);
        this._eventManager.removeEventListener(CAEP_MICROFRONTEND_REMOTE_TRANSLATIONS_LOAD_EVENT_NAME, this.onRemoteTranslationsLoad);
        this._eventManager.removeEventListener(CAEP_MICROFRONTEND_REMOTE_TRANSLATIONS_CHANGE_EVENT_NAME, this.onRemoteTranslationsChange);
        this._eventManager.removeEventListener(CAEP_MICROFRONTEND_SHELL_DEFAULT_LANG_REQUEST_EVENT_NAME, this.onDefaultLangRequest);
    }

    /**
     * Remote translations' load event handler
     * 
     * @param remoteName remote app whose translations belong to
     * @param translations translations object
     */
    private async onRemoteTranslationsLoad(remoteName: string, translations: { [key: string]: { [key: string]: any } }) {
        const langs = Object.keys(translations);
        if(langs.length === 1 && !this._translateService.translations[langs[0]]) {
            this._translateService.onLangChange.pipe(take(1), takeUntil(this._destroy$)).subscribe(() => {
                this._translateService.setRemoteTranslation(langs[0], translations[langs[0]], true);
            });
        } else {
            for(const lang of langs) {
                if(!this._translateService.translations[lang]) {
                    await lastValueFrom(this._translateService.getTranslation(lang));
                }
                this._translateService.setRemoteTranslation(lang, translations[lang], true);
            }
        }
    }

    /**
     * Remote translations' change event handler
     * 
     * @param remoteName remote app whose translations belong to
     * @param translations translations object
     */
    private async onRemoteTranslationsChange(remoteName: string, translations: { [key: string]: { [key: string]: any } }) {
        const langs = Object.keys(translations);
        if(langs.length === 1 && !this._translateService.translations[langs[0]]) {
            this._translateService.onLangChange.pipe(take(1), takeUntil(this._destroy$)).subscribe(() => {
                this._translateService.setRemoteTranslation(langs[0], translations[langs[0]], true, CaepTranslationMergeMode.REMOTE);
            });
        } else {
            for(const lang of langs) {
                if(!this._translateService.translations[lang]) {
                    await lastValueFrom(this._translateService.getTranslation(lang));
                }
                this._translateService.setRemoteTranslation(lang, translations[lang], true, CaepTranslationMergeMode.REMOTE);
            }
        }
    }

    /**
     * Event handler for shell's default lang request
     * 
     * @param remoteName name of the remote the request comes from
     */
    private onDefaultLangRequest(remoteName: string) {
        if(this._translateService.defaultLang) {
            const flatCaseAppName = remoteName.split('-').join('');
            const shellDefaultLangChangeEventName = getMfShellDefaultLangChangeEventName(flatCaseAppName);
            this._eventManager.dispatch(shellDefaultLangChangeEventName, this._translateService.defaultLang);
        }
    }

    /**
     * Syncs locales between shell and remotes
     */
    private syncLocales() {
        this._translateService.onLangChange
            .pipe(takeUntil(this._destroy$))
            .subscribe((event: LangChangeEvent) => this._localeService.setLocale(event.lang));
        this._localeService
            .getLocale()
            .pipe(takeUntil(this._destroy$))
            .subscribe((lang: string) => this._translateService.use(lang));
    }

}