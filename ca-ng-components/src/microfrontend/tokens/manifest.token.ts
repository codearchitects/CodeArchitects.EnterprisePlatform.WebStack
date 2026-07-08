import { InjectionToken } from '@angular/core';
import { CaepMicrofrontendManifestProvider } from '../models';

export const CAEP_MICROFRONTEND_MANIFEST_TOKEN = new InjectionToken<CaepMicrofrontendManifestProvider>('Manifest provider');