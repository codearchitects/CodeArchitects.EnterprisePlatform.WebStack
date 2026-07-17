import { NgModule, ModuleWithProviders } from '@angular/core';
import { TranslateModule, TranslateModuleConfig } from '@ngx-translate/core';

import { LocaleService } from './locale.service';
import { I18nService } from './i18n.service';
import { I18nPipe } from './i18n.pipe';

@NgModule({
  imports: [
    TranslateModule
  ],
  declarations: [
    I18nPipe
  ],
  exports: [
    I18nPipe
  ],
  providers: []
})
export class I18nModule { }
