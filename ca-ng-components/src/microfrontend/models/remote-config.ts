import { Manifest, RemoteConfig } from '@angular-architects/module-federation';

export type CaepRemoteConfig = RemoteConfig & {
  exposedModule: string;
  displayName: string;
  routePath: string;
  ngModuleName: string;
  exposedBootstrapModule: string;
  //elementName?: string;
};

export type CaepApplicationManifest<T extends CaepRemoteConfig = CaepRemoteConfig> = Manifest<T>;