import { NgModule, ModuleWithProviders } from '@angular/core';
import { I18nPipe } from './i18n.pipe';
import { I18nService } from './i18n.service';

@NgModule({
  declarations: [
    I18nPipe
  ],
  exports: [
    I18nPipe
  ],
  providers: []
})
export class I18nModule { 

  static forRoot(): ModuleWithProviders<I18nModule> {
    return {
      ngModule: I18nModule,
      providers: [ I18nService ]
    };
  }

  static forChild(): ModuleWithProviders<I18nModule> {
    return {
      ngModule: I18nModule,
      providers: [ I18nService ]
    };
  }

}
