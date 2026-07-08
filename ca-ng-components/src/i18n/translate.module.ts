import { ModuleWithProviders, NgModule } from '@angular/core';
import { DEFAULT_LANGUAGE, FakeMissingTranslationHandler, MissingTranslationHandler, TranslateCompiler, TranslateDefaultParser, TranslateFakeCompiler, TranslateFakeLoader, TranslateLoader, TranslateModuleConfig, TranslateParser, TranslateService, TranslateStore, USE_DEFAULT_LANG, USE_EXTEND, USE_STORE } from '@ngx-translate/core';
import { SH_TRANSLATE_PREFIX } from './translate-prefix.token';
import { ShTranslateDirective } from './translate.directive';
import { ShTranslatePipe } from './translate.pipe';
import { ShTranslateService } from './translate.service';

export type ShTranslateModuleConfig = TranslateModuleConfig & {
  prefix?: string;
}

@NgModule({
  declarations: [ShTranslatePipe, ShTranslateDirective],
  exports: [ShTranslatePipe, ShTranslateDirective]
})
export class ShTranslateModule { 
  /**
   * Use this method in your root module to provide the ShTranslateService
   */
  static forRoot(/*config: TranslateModuleConfig = {}*/config: ShTranslateModuleConfig = {}): ModuleWithProviders<ShTranslateModule> {
    return {
      ngModule: ShTranslateModule,
      providers: [
        config.loader || {provide: TranslateLoader, useClass: TranslateFakeLoader},
        config.compiler || {provide: TranslateCompiler, useClass: TranslateFakeCompiler},
        config.parser || {provide: TranslateParser, useClass: TranslateDefaultParser},
        config.missingTranslationHandler || {provide: MissingTranslationHandler, useClass: FakeMissingTranslationHandler},
        TranslateStore,
        {provide: USE_STORE, useValue: config.isolate},
        {provide: USE_DEFAULT_LANG, useValue: config.useDefaultLang},
        {provide: USE_EXTEND, useValue: config.extend},
        {provide: DEFAULT_LANGUAGE, useValue: config.defaultLanguage},
        {provide: SH_TRANSLATE_PREFIX, useValue: config.prefix},
        ShTranslateService,
        {provide: TranslateService, useExisting: ShTranslateService}
      ]
    };
  }

  /**
   * Use this method in your other (non root) modules to import the directive/pipe
   */
  static forChild(config: ShTranslateModuleConfig = {}): ModuleWithProviders<ShTranslateModule> {
    return {
      ngModule: ShTranslateModule,
      providers: [
        config.loader || {provide: TranslateLoader, useClass: TranslateFakeLoader},
        config.compiler || {provide: TranslateCompiler, useClass: TranslateFakeCompiler},
        config.parser || {provide: TranslateParser, useClass: TranslateDefaultParser},
        config.missingTranslationHandler || {provide: MissingTranslationHandler, useClass: FakeMissingTranslationHandler},
        {provide: USE_STORE, useValue: config.isolate},
        {provide: USE_DEFAULT_LANG, useValue: config.useDefaultLang},
        {provide: USE_EXTEND, useValue: config.extend},
        {provide: DEFAULT_LANGUAGE, useValue: config.defaultLanguage},
        {provide: SH_TRANSLATE_PREFIX, useValue: config.prefix},
        ShTranslateService,
        {provide: TranslateService, useExisting: ShTranslateService}
      ]
    };
  }
}