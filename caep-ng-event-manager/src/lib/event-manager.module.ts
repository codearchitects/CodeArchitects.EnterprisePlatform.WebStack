import { NgModule } from '@angular/core';
import { CaepEventManagerService } from './services/event-manager.service';

@NgModule({
  providers: [
    CaepEventManagerService
  ]
})
export class CaepEventManagerModule { }