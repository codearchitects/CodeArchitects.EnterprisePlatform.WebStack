import { I18nService } from '@ca-webstack/ng-i18n';
import { DEFAULT_LANGUAGE, FakeMissingTranslationHandler, MissingTranslationHandler, TranslateCompiler, TranslateDefaultParser, TranslateFakeCompiler, TranslateFakeLoader, TranslateLoader, TranslateParser, TranslateService, USE_DEFAULT_LANG, USE_EXTEND, USE_STORE } from '@ngx-translate/core';
import { SH_TRANSLATE_PREFIX } from './translate-prefix.token';
import { ShTranslateModuleConfig } from './translate.module';
import { ShTranslateService } from './translate.service';

export function getTranslationProviders(translateConfig: ShTranslateModuleConfig) {
    return [
        translateConfig.loader || {provide: TranslateLoader, useClass: TranslateFakeLoader},
        translateConfig.compiler || {provide: TranslateCompiler, useClass: TranslateFakeCompiler},
        translateConfig.parser || {provide: TranslateParser, useClass: TranslateDefaultParser},
        translateConfig.missingTranslationHandler || {provide: MissingTranslationHandler, useClass: FakeMissingTranslationHandler},
        {provide: USE_STORE, useValue: translateConfig.isolate},
        {provide: USE_DEFAULT_LANG, useValue: translateConfig.useDefaultLang},
        {provide: USE_EXTEND, useValue: translateConfig.extend},
        {provide: DEFAULT_LANGUAGE, useValue: translateConfig.defaultLanguage},
        {provide: SH_TRANSLATE_PREFIX, useValue: translateConfig.prefix},
        ShTranslateService,
        {provide: TranslateService, useExisting: ShTranslateService},
        I18nService
    ];
}