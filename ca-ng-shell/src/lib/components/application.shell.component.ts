import { Injector, Optional, Directive, inject } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Observable, Subject, SubscriptionLike, concatMap, lastValueFrom, map, take, takeUntil } from 'rxjs';
import { CommandDispatcherService } from '@ca-webstack/ng-command-dispatcher';
import { BaseShellComponent } from './base.shell.component';
import { INavigateArgs, IStackFrameInfo, NEXT_STACK_FRAME_STORAGE_KEY } from '../types/index';
import { BaseDelegates } from '../services/index';
import { Activity } from './activity';
import { SignalRService } from '@ca-webstack/ng-signalr';
import { Location } from '@angular/common';
import * as _ from 'lodash-es';
import { LocaleService } from '@ca-webstack/ng-i18n';
import { CAEP_MICROFRONTEND_REMOTE_TRANSLATIONS_CHANGE_EVENT_NAME, CAEP_MICROFRONTEND_REMOTE_TRANSLATIONS_LOAD_EVENT_NAME, CAEP_MICROFRONTEND_SHELL_DEFAULT_LANG_REQUEST_EVENT_NAME, CaepPopoverService, ShTranslateService, 
  getMfShellDefaultLangChangeEventName, getMfRemoteInternalTranslationsChangeEventName, getMfRemoteInternalTranslationsRequestEventName, CAEP_MICROFRONTEND_DISABLE_REMOTE_ENTRY_TOKEN } 
from '@ca-webstack/ng-components';
import { LangChangeEvent, TranslationChangeEvent } from '@ngx-translate/core';

/**
 * Application Shell base component
 */
@Directive()
export abstract class ApplicationShellComponent<TSignalrSubscription = any> extends BaseShellComponent<TSignalrSubscription>{
  /**
   * Next stack
   */
  private get _nextStack() {
    return this.delegates.serializer.deserialize(sessionStorage.getItem(NEXT_STACK_FRAME_STORAGE_KEY) || '[]');
  }
  private set _nextStack(frames: Array<IStackFrameInfo | Array<IStackFrameInfo>>) {
    sessionStorage.setItem(NEXT_STACK_FRAME_STORAGE_KEY, this.delegates.serializer.serialize(frames || []));
  }
  /**
   * History back count
   */
  private _historyCount = 0;
  /**
   * Subscription to Location Service
   */
  private _localSubscriptions: SubscriptionLike[] = [];

  /**
   * Langs whose translations have been communicated to the shell of multi-application architecture
   */
  private readonly _communicatedLangs: string[] = [];
  /**
   * Event name for internal translations' management of remote translations' change
   */
  private _internalTranslationsChangeEventName: string;
  /**
   * Event name for internal translations' management of remote translations' request
   */
  private _internalTranslationsRequestEventName: string;
  /**
   * Event name of the shell's default lang change
   */
  private _shellDefaultLangChangeEventName: string;
  /**
   * PopoverService instance
   */
  private _popoverService = inject(CaepPopoverService);
  /**
   * TranslateService instance
   */
  protected translateService = inject(ShTranslateService);
  /**
   * LocaleService instance
   */
  protected localeService = inject(LocaleService);
  /**
   * Subject which notifies subscribers when component destroys itself
   */
  protected destroy$ = new Subject<void>();
  /**
   * Flag which indicates whether remote entry handling is disabled
   */
  protected isRemoteEntryDisabled = inject(CAEP_MICROFRONTEND_DISABLE_REMOTE_ENTRY_TOKEN, { optional: true }) ?? false;

  /**
   * default constructor
   * @param applicationName
   * @param injector
   * @param router
   * @param commandDispatcher
   * @param activatedRoute
   * @param delegates
   * @param activity
   * @param hubName
   * @param signalr
   */
  public constructor(
    public applicationName: string,
    injector: Injector,
    router: Router,
    commandDispatcher: CommandDispatcherService,
    activatedRoute: ActivatedRoute,
    delegates: BaseDelegates,
    activity?: Activity<any>,
    hubName?: string,
    @Optional() signalr?: SignalRService
  ) {
    super(injector, router, commandDispatcher, activatedRoute, delegates, activity, hubName, signalr);
    this.handleBrowserNavigation(injector.get(Location));
    const flatCaseAppName = applicationName.split('-').join('');
    this._internalTranslationsChangeEventName = getMfRemoteInternalTranslationsChangeEventName(flatCaseAppName);
    this._internalTranslationsRequestEventName = getMfRemoteInternalTranslationsRequestEventName(flatCaseAppName);
    this._shellDefaultLangChangeEventName = getMfShellDefaultLangChangeEventName(flatCaseAppName);
  }

  private handleBrowserNavigation(location: Location) {
    this._localSubscriptions.push(location.subscribe(event => {
      if (!this._historyCount && event.pop === true && event.type === "popstate") {
        this._historyCount = 1;
        const stack = Activity.CurrentPayload.stack;
        const nextStack = this._nextStack;
        const nextStackFrameInfo = nextStack[nextStack.length - 1];
        if (Array.isArray(nextStackFrameInfo)) {
          if (nextStackFrameInfo[0].url === event.url) {
            this._historyCount = 1;
          } else {
            const frame = stack[stack.length - 1];
            const nextFrame = nextStackFrameInfo[0].frame;
            const startUrl = `${nextFrame.application}/${nextFrame.domain}/${nextFrame.scenario[0]}/start`.replace(/,/g, '/');
            if (event.url.indexOf(startUrl) > -1) {
              nextStack.push({ frame, url: `/${frame.application}/${frame.domain}/${frame.scenario}/${frame.action}`.replace(/,/g, '/') })
            } else {
              stack.pop();
              nextStack.push({ frame, url: `/${frame.application}/${frame.domain}/${frame.scenario}/${frame.action}`.replace(/,/g, '/') })
            }
          }
        } else if (nextStackFrameInfo?.url.lastIndexOf('/start') > -1) {
          // nothing
        } else if (nextStackFrameInfo?.url === event.url) {
          stack.push(nextStackFrameInfo.frame);
          nextStack.pop();
        } else {
          const frame = stack[stack.length - 1];
          const startUrl = `${frame.application}/${frame.domain}/${frame.scenario}/start`.replace(/,/g, '/');
          nextStack.push({ url: this.router.url, frame });
          if (event.url.indexOf(startUrl) > -1) {
            this._historyCount = 3;
            history.go(-2);
            nextStack.pop();
            nextStack.push([{ url: this.router.url, frame, start: true }]);
          } else {
            stack.pop();
          }
        }
        /**
         * Saves next stack in the session
         */
        this._nextStack = nextStack;
      }
    }));
  }

  public ngOnInit() {
    super.ngOnInit();
    if (!this.isRemoteEntryDisabled) {
      this.eventManagerService.registerEventListener(this._internalTranslationsChangeEventName, this.onRemoteInternalTranslationsChange, this);
      this.eventManagerService.registerEventListener(this._internalTranslationsRequestEventName, this.onRemoteInternalTranslationsRequest, this);
      this.eventManagerService.registerEventListener(this._shellDefaultLangChangeEventName, this.onShellDefaultLangChange, this);
      this.translateService.onTranslationChange
        .pipe(takeUntil(this.destroy$))
        .subscribe((event: TranslationChangeEvent) => {
          if(this._communicatedLangs.includes(event.lang)) {
            this.eventManagerService.dispatch(CAEP_MICROFRONTEND_REMOTE_TRANSLATIONS_CHANGE_EVENT_NAME, this.applicationName, { [event.lang]: event.translations });
            this.eventManagerService.dispatch(this._internalTranslationsChangeEventName, this.applicationName, { [event.lang]: event.translations });
          }
        });
      this._popoverService.addLangs(this.translateService.langs);
      this.syncLocales();
    }
  }

  public ngAfterViewInit() {
    super.ngAfterViewInit();
    this._localSubscriptions.push(
      this.router.events.subscribe(e => {
        if (e instanceof NavigationEnd) {
          if (!this._historyCount) {
            this._nextStack = [];
          }
          if (this._historyCount) {
            this._historyCount--;
          }
        }
      })
    );
  }

  public ngOnDestroy() {
    super.ngOnDestroy();
    this._localSubscriptions?.forEach(subscription => {
      subscription.unsubscribe();
    });
    this._localSubscriptions = [];
    this.destroy$.next();
    this.destroy$.complete();
    if (!this.isRemoteEntryDisabled) {
      this._popoverService.removeLangs(this.translateService.langs);
      this.eventManagerService.removeEventListener(this._internalTranslationsChangeEventName, this.onRemoteInternalTranslationsChange);
      this.eventManagerService.removeEventListener(this._internalTranslationsRequestEventName, this.onRemoteInternalTranslationsRequest);
      this.eventManagerService.removeEventListener(this._shellDefaultLangChangeEventName, this.onShellDefaultLangChange);
    }
  }

  /**
   * navigates to new destination
   * @param args navigation arguments
   */
  public navigate(args: INavigateArgs): Observable<boolean> {
    return super.navigate({
      application: args.application || this.applicationName,
      domain: args.domain,
      scenario: args.scenario,
      action: args.action,
      queryParams: args.queryParams
    });
  }

  /**
   * Event handler for remote internal translations' change
   * 
   * @param senderId id of the event dispatcher
   * @param translations translations object
   */
  private onRemoteInternalTranslationsChange(senderId: string, translations: { [key: string]: { [key: string]: any } }) {
    if(senderId !== this.applicationName) {
      const lang = Object.keys(translations)[0];
      if(!this.translateService.translations[lang]) {
        this.translateService.onLangChange.pipe(take(1), takeUntil(this.destroy$)).subscribe(() => {
          if(!_.isEqual(this.translateService.translations[lang], translations[lang]))
            this.translateService.setTranslation(lang, { ...translations[lang] }/*, true*/);
        });
      } else {
        if(!_.isEqual(this.translateService.translations[lang], translations[lang]))
          this.translateService.setTranslation(lang, { ...translations[lang] }/*, true*/);
      }
    }
  }

  /**
   * Event handler for remote internal translations' request
   * 
   * @param senderId id of the event dispatcher
   * @param langs langs specified into the request
   */
  private async onRemoteInternalTranslationsRequest(senderId: string, langs: string[]) {
    if(langs.length === 1 && !this.translateService.translations[langs[0]]) {
      this.translateService.onLangChange.pipe(take(1), takeUntil(this.destroy$)).subscribe(() => {
        this.eventManagerService.dispatch(this._internalTranslationsChangeEventName, this.applicationName, { [langs[0]]: this.translateService.translations[langs[0]] });
      });
    } else {
      const translations: any = {};
      for(const lang of langs) {
        if(!this.translateService.translations[lang]) {
          await lastValueFrom(this.translateService.getTranslation(lang));
        }
        translations[lang] = this.translateService.translations[lang];
      }
      this.eventManagerService.dispatch(this._internalTranslationsChangeEventName, this.applicationName, translations);
    }
  }

  /**
   * Shell's default lang change event handler
   * 
   * @param lang shell's default lang
   */
  private async onShellDefaultLangChange(lang: string) {
    if(lang !== this.translateService.defaultLang && lang !== this.translateService.currentLang) {
      if(!this.translateService.translations[lang]) {
        const translations: any = {};
        const translation = await lastValueFrom(this.translateService['retrieveTranslations'](lang));
        translations[lang] = translation || {};
        this.eventManagerService.dispatch(CAEP_MICROFRONTEND_REMOTE_TRANSLATIONS_LOAD_EVENT_NAME, this.applicationName, translations);
        this._communicatedLangs.push(lang);
      } else if(!this._communicatedLangs.includes(lang))
        this._communicatedLangs.push(lang);
    }
  }

  /**
   * Syncs locales between shell and remotes, then passes translations to the shell
   */
  private syncLocales() {
    let firstLangLoading = true;
    this.translateService.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: LangChangeEvent) => this.localeService.setLocale(event.lang));
    this.localeService
      .getLocale()
      .pipe(
        takeUntil(this.destroy$),
        concatMap((lang: string) => this.translateService.use(lang).pipe(map((translations: any) => {
            return { lang, translations };
          })
        ))
      ).subscribe((res) => {
        if(firstLangLoading) {
          this.loadTranslations();
          this.eventManagerService.dispatch(CAEP_MICROFRONTEND_SHELL_DEFAULT_LANG_REQUEST_EVENT_NAME, this.applicationName);
          firstLangLoading = false;
        } else if(!this._communicatedLangs.includes(res.lang)) {
          this.eventManagerService.dispatch(CAEP_MICROFRONTEND_REMOTE_TRANSLATIONS_LOAD_EVENT_NAME, this.applicationName, { [res.lang]: res.translations });
          this._communicatedLangs.push(res.lang);
        }
      });
  }

  /**
   * Loads and communicates initial translations to the shell
   */
  private async loadTranslations() {
    const translations: any = {};
    const defaultLang = this.translateService.defaultLang;
    const currentLang = this.translateService.currentLang;
    if(defaultLang && defaultLang !== currentLang) {
      if(!this.translateService.translations[defaultLang]) {
        const translation = await lastValueFrom(this.translateService.getTranslation(defaultLang));
        translations[defaultLang] = translation || {};
      } else {
        translations[defaultLang] = this.translateService.translations[defaultLang];
      }
      this._communicatedLangs.push(defaultLang);
    }
    if(currentLang) {
      translations[currentLang] = this.translateService.translations[currentLang];
      this._communicatedLangs.push(currentLang);
    }
    this.eventManagerService.dispatch(CAEP_MICROFRONTEND_REMOTE_TRANSLATIONS_LOAD_EVENT_NAME, this.applicationName, translations);
  }
}
