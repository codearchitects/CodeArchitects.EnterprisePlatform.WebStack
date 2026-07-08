import { Injectable, OnDestroy, inject } from '@angular/core';
import { Subject, concatMap, lastValueFrom, map, take, takeUntil } from 'rxjs';
import { ShTranslateService } from '../../i18n';
import { LocaleService } from '@ca-webstack/ng-i18n';
import { CaepEventManagerService } from '@caep/ng-event-manager';
import { UUID } from 'angular2-uuid';
import { CAEP_MICROFRONTEND_REMOTE_TRANSLATIONS_CHANGE_EVENT_NAME, CAEP_MICROFRONTEND_REMOTE_TRANSLATIONS_LOAD_EVENT_NAME, getMfRemoteInternalTranslationsChangeEventName, getMfRemoteInternalTranslationsRequestEventName } from './util';
import { LangChangeEvent, TranslationChangeEvent } from '@ngx-translate/core';
import * as _ from 'lodash-es';

export interface ICaepRemoteStandaloneParams {
    appName: string;
    standaloneName: string;
}

@Injectable()
export class CaepRemoteStandaloneService<T = any> implements OnDestroy {

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
     * Name of the remote in the multi-application architecture the standalone component belongs to
     */
    private _appName: string;
    /**
     * Standalone component's id
     */
    private _standaloneId: string;
    /**
     * Event name for internal translations' management of remote translations' change
     */
    private _internalTranslationsChangeEventName: string;
    /**
     * Event name for internal translations' management of remote translations' request
     */
    private _internalTranslationsRequestEventName: string;
    /**
     * Standalone component instance
     */
    private _component: T;

    /**
     * Initializes multi-application management for the standalone component
     * 
     * @param component standalone component instance
     * @param params ICaepRemoteStandaloneParams params
     */
    public init(component: T, params: ICaepRemoteStandaloneParams) {
        this._component = component;
        this._appName = params.appName;
        this._standaloneId = params.appName + '.' + params.standaloneName +  '.' + UUID.UUID();
        const flatCaseAppName = params.appName.split('-').join('');
        this._internalTranslationsChangeEventName = getMfRemoteInternalTranslationsChangeEventName(flatCaseAppName);
        this._internalTranslationsRequestEventName = getMfRemoteInternalTranslationsRequestEventName(flatCaseAppName);
        this._eventManager.registerEventListeners(component);
        this._eventManager.registerEventListener(this._internalTranslationsChangeEventName, this.onRemoteInternalTranslationsChange, this);
        this._translateService.onTranslationChange
            .pipe(takeUntil(this._destroy$))
            .subscribe((event: TranslationChangeEvent) => {
                if(this._communicatedLangs.includes(event.lang)) { 
                    if(this._component['_ɵCAEPMFRemote']) {
                        this._eventManager.dispatch(CAEP_MICROFRONTEND_REMOTE_TRANSLATIONS_CHANGE_EVENT_NAME, params.appName, { [event.lang]: event.translations });
                    } else {
                        this._eventManager.dispatch(this._internalTranslationsChangeEventName, this._standaloneId, { [event.lang]: event.translations });
                    }
                }
            });
        this.syncLocales();
    }

    public ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
        this._eventManager.removeEventListeners(this._component);
        this._eventManager.removeEventListener(this._internalTranslationsChangeEventName, this.onRemoteInternalTranslationsChange);
    }

    /**
     * Event handler for remote internal translations' change
     * 
     * @param senderId id of the event dispatcher
     * @param translations translations object
     */
    private onRemoteInternalTranslationsChange(senderId: string, translations: { [key: string]: { [key: string]: any } }) {
        if(senderId !== this._standaloneId) {
            const langs = Object.keys(translations);
            if(langs.length === 1 && !this._translateService.translations[langs[0]]) {
                this._translateService.onLangChange.pipe(take(1), takeUntil(this._destroy$)).subscribe(() => {
                    if(!_.isEqual(this._translateService.translations[langs[0]], translations[langs[0]]))
                        this._translateService.setTranslation(langs[0], { ...translations[langs[0]] }/*, true*/);
                });
            } else {
                langs.forEach((lang) => {
                    if(!_.isEqual(this._translateService.translations[lang], translations[lang]))
                        this._translateService.setTranslation(lang, { ...translations[lang] }/*, true*/);
                });
            }
        }
    }

    /**
     * Syncs locales between shell and remotes, then passes translations to the shell
     */
    private syncLocales() {
        let firstLangLoading = true;
        this._translateService.onLangChange
            .pipe(takeUntil(this._destroy$))
            .subscribe((event: LangChangeEvent) => this._localeService.setLocale(event.lang));
        this._localeService.getLocale()
            .pipe(
                takeUntil(this._destroy$),
                concatMap((lang: string) => this._translateService.use(lang).pipe(map((translations: any) => {
                    return { lang, translations };
                    })
                ))
            ).subscribe((res) => {
                if(firstLangLoading) {
                    if(this._component['_ɵCAEPMFRemote']) {
                        this.loadTranslations();
                    } else {
                        const langs = this._translateService.defaultLang && this._translateService.defaultLang !== this._translateService.currentLang ? [ this._translateService.defaultLang, this._translateService.currentLang ] : [ this._translateService.currentLang ];
                        this._eventManager.dispatch(this._internalTranslationsRequestEventName, this._standaloneId, langs);
                        this._communicatedLangs.push(...langs);
                    }
                    if(this._component['caepAfterCurrentLangLoaded']) {
                        this._component['caepAfterCurrentLangLoaded']();
                    }
                    firstLangLoading = false;
                } else if(!this._communicatedLangs.includes(res.lang)) {
                    if(this._component['_ɵCAEPMFRemote']) {
                        this._eventManager.dispatch(CAEP_MICROFRONTEND_REMOTE_TRANSLATIONS_LOAD_EVENT_NAME, this._appName, { [res.lang]: res.translations });
                    } else {
                        this._eventManager.dispatch(this._internalTranslationsRequestEventName, this._standaloneId, [ res.lang ]);
                    }
                    this._communicatedLangs.push(res.lang);
                }
                //eventual on init set translation
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