import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CaepMicrofrontendService {

    private _microfrontends: Array<{ application: string; instance: any }> = [];

    public addMicrofrontend(application: string) {
        this._microfrontends.push({ application, instance: undefined });
    }
    
    public setMicrofrontend(application: string, mfe: any) {
        const microfrontend = this._microfrontends.find(microfrontend => microfrontend.application === application && microfrontend.instance === undefined);
        if(microfrontend)
            microfrontend.instance = mfe;
    }

    public removeMicrofrontend(mfe: any) {
        const index = this._microfrontends.findIndex(microfrontend => microfrontend.instance === mfe);
        if(index > -1)
            this._microfrontends.splice(index, 1);
    }

    public getMicrofrontendsCountByApplication(application: string) {
        return this._microfrontends.filter(microfrontend => microfrontend.application === application).length;
    }
    
}