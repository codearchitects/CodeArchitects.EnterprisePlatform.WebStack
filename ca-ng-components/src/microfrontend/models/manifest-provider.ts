import { Manifest } from '@angular-architects/module-federation';
import { CaepRemoteConfig } from './remote-config';

export abstract class CaepMicrofrontendManifestProvider<T extends CaepRemoteConfig = CaepRemoteConfig> {

    abstract getManifest(): Promise<Manifest<T>>;

}