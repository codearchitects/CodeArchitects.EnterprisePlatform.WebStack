import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { I18nModule } from '@ca-webstack/ng-i18n';
import { ShTranslateModule } from '../../i18n/translate.module';
import { CaepMicrofrontendManifestProvider } from '../models';
import { CAEP_MICROFRONTEND_MANIFEST_TOKEN } from '../tokens';
import { CaepMicrofrontendComponent } from './microfrontend.component';

export interface CaepMicrofrontendConfig {
    manifestProvider: Type<CaepMicrofrontendManifestProvider>
}

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        I18nModule,
        ShTranslateModule
    ],
    declarations: [ CaepMicrofrontendComponent ],
    exports: [ CaepMicrofrontendComponent ]
})
export class CaepMicrofrontendModule {
    static forRoot(config: CaepMicrofrontendConfig): ModuleWithProviders<CaepMicrofrontendModule> {
        return {
            ngModule: CaepMicrofrontendModule,
            providers: [
                { provide: CAEP_MICROFRONTEND_MANIFEST_TOKEN, useClass: config.manifestProvider }
            ]
        };
    }
}