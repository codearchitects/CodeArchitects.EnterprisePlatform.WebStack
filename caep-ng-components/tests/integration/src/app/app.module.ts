import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ContextService } from '@ca-webstack/ng-aspects';
import { I18nModule } from '@ca-webstack/ng-i18n';
import { CaepComponentsModule } from '@caep/ng-components';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
// import 'numeral/locales/it';
import { AppComponent } from './app.component';
import { RoutingModule } from './app.routes';
import { BaseAuthChildComponent, BaseChildComponent, BaseFormattedChildComponent, BaseInputChildComponent, BaseLookupMultiChildComponent, BaseLookupSingleChildComponent, BaseModelChildComponent, InversePersonPipe, MyCurrencyPipe, PersonPipe } from './components/base';
import { ColorsPageComponent } from './components/colors-page/colors-page.component';
import { ColorsViewerComponent } from './components/colors-viewer/colors-viewer.component';
import { ColumnsExamplePageComponent } from './components/columns-example-page/columns-example-page.component';
import { GridViewerComponent } from './components/grid-viewer/grid-viewer.component';

@NgModule({
  declarations: [
    AppComponent,
    ColorsViewerComponent,
    GridViewerComponent,
    BaseChildComponent,
    BaseAuthChildComponent,
    BaseModelChildComponent,
    BaseInputChildComponent,
    BaseFormattedChildComponent,
    MyCurrencyPipe,
    ColorsPageComponent,
    ColumnsExamplePageComponent,
    BaseLookupSingleChildComponent,
    PersonPipe,
    InversePersonPipe,
    BaseLookupMultiChildComponent,
  ],
  imports: [
    BrowserModule,
    CaepComponentsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot(),
    RoutingModule,
    I18nModule.forRoot()
  ],
  providers: [ContextService],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(translate: TranslateService) {
    const lang = navigator.language.substring(0, 2);
    translate.use(lang);
  }
}
