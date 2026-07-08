import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef, reflectComponentType, TemplateRef, OnChanges, SimpleChanges, ComponentRef, OnDestroy, Type, Inject, Optional, SimpleChange } from '@angular/core';
import { loadRemoteModule, Manifest } from '@angular-architects/module-federation';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CaepMicrofrontendManifestProvider, CaepRemoteConfig } from '../models';
import { CAEP_MICROFRONTEND_FALLBACK_TOKEN, CAEP_MICROFRONTEND_MANIFEST_TOKEN } from '../tokens';
import { CaepMicrofrontendService } from './service/microfrontend.service';
import { isNoU } from '../../utilities';

export interface ICaepMicrofrontendEvent<T = any> {
    name: string; 
    payload?: T
}

@Component({
    selector: 'caep-microfrontend',
    template: `
        <ng-template #content>
            <ng-content></ng-content>
        </ng-template>
        <ng-container #target></ng-container>
        `,
    standalone: false
})
export class CaepMicrofrontendComponent<T = any, C extends CaepRemoteConfig = CaepRemoteConfig, M extends CaepMicrofrontendManifestProvider<C> = CaepMicrofrontendManifestProvider<C>>  implements OnInit, OnChanges, OnDestroy {

    @Input() application: string;
    @Input() component: string;
    @Input() payload: { [key: string]: any };
    @Input() fallback: Type<any>;
    @Input() fallbackPayload: { [key: string]: any };
    @Output() event: EventEmitter<ICaepMicrofrontendEvent> = new EventEmitter();
    @Output() fallbackEvent: EventEmitter<ICaepMicrofrontendEvent> = new EventEmitter();

    /**
     * Template reference
     */
    @ViewChild('content', { read: TemplateRef, static: true })
    private _content: TemplateRef<any>;

    /**
     * Reference to target element
     */
    @ViewChild('target', { read: ViewContainerRef, static: true }) 
    private _target: ViewContainerRef;

    /**
     * References to component
     */
    private _componentRef: ComponentRef<T>;

    /**
     * ngContentSelectors of the component to create
     */
    private _contentSelectors: readonly string[];
    private _inputs: readonly {
        readonly propName: string;
        readonly templateName: string;
    }[];
    private _outputs: readonly {
        readonly propName: string;
        readonly templateName: string;
    }[];

    /**
     * Nodes passed as content to the component using content projection
     */
    private _contentNodes: any[] = [];
    private _destroy$: Subject<void> = new Subject();

    /**
     * Flag for creating microfrontend in the ngOnChanges lifecycle hook
     */
    private _firstChange = true;
    private _isMicrofrontendLoaded = false;
    private _applicationBootstrapModule: any;

    constructor(@Inject(CAEP_MICROFRONTEND_MANIFEST_TOKEN) public manifestProvider: M, public microfrontendService: CaepMicrofrontendService, @Optional()@Inject(CAEP_MICROFRONTEND_FALLBACK_TOKEN) public providedFallback: Type<any>) { }

    public async ngOnChanges(changes: SimpleChanges) {
        if(this._firstChange) {
            this._firstChange = false;
            await this.createMicrofrontend();
        } else if(this._componentRef && /*this._isFrontendLoaded &&*/ (changes['payload'] || changes['fallbackPayload'])) {
            this.updateParams();
        }
        if(this._componentRef?.instance['ngOnChanges']) {
            if(this._isMicrofrontendLoaded && changes['payload']) {
                const simpleChanges = this.getSimpleChangesFromPayload(changes['payload']);
                if(Object.keys(simpleChanges).length)
                    this._componentRef.instance['ngOnChanges'](simpleChanges);
            } else if(!this._isMicrofrontendLoaded && changes['fallbackPayload']) {
                const simpleChanges = this.getSimpleChangesFromPayload(changes['fallbackPayload']);
                if(Object.keys(simpleChanges).length)
                    this._componentRef.instance['ngOnChanges'](simpleChanges);
            }
        }
    }

    public async ngOnInit() {
        if(this._firstChange) {
            this._firstChange = false;
            await this.createMicrofrontend();
        }
    }

    public ngOnDestroy() {
        if(this._isMicrofrontendLoaded) {
            this.microfrontendService.removeMicrofrontend(this._componentRef.instance);
        }
        this._destroy$.next();
        this._destroy$.complete();
    }

    private async createMicrofrontend() {
        const manifest = await this.manifestProvider.getManifest();
        if(manifest[this.application]) {
            let remoteModule: any;
            await loadRemoteModule({
                type: 'module',
                remoteEntry: manifest[this.application].remoteEntry,
                exposedModule: './' + this.component
            }).then(m => {
                remoteModule = m;
                this.microfrontendService.addMicrofrontend(this.application);
                if(this.microfrontendService.getMicrofrontendsCountByApplication(this.application) === 1)
                    return this.loadApplicationGlobalStylesAndScripts(manifest, false);
                else    
                    return this.loadApplicationGlobalStylesAndScripts(manifest, true);
            }).catch(err => {
                console.error('Error loading remote microfrontend: ', err);
            });
            if(remoteModule) {
                this._isMicrofrontendLoaded = true;
                this.createComponent(remoteModule[this.component]);
                this.microfrontendService.setMicrofrontend(this.application, this._componentRef.instance);
                this._componentRef.instance['_ɵCAEPMFRemote'] = true;
            } else if(this.fallback || this.providedFallback) {
                this.createComponent(this.fallback ?? this.providedFallback);
            }
        } else if(this.fallback || this.providedFallback) {
            this.createComponent(this.fallback ?? this.providedFallback);
        }
    }

    private async loadApplicationGlobalStylesAndScripts(manifest: Manifest<C>, pending: boolean) {
        this._applicationBootstrapModule = await loadRemoteModule({
            type: 'module',
            remoteEntry: manifest[this.application].remoteEntry,
            exposedModule: manifest[this.application].exposedBootstrapModule
        });
        return this._applicationBootstrapModule.loadGlobalStylesAndScripts(pending);
    }

    private updateParams() {
        for(const input of this._inputs) {
            if(this._isMicrofrontendLoaded) {
                if(!isNoU(this.payload?.[input.templateName])) {
                    this._componentRef.instance[input.propName] = this.payload[input.templateName];
                }
            } else {
                if(!isNoU(this.fallbackPayload?.[input.templateName])) {
                    this._componentRef.instance[input.propName] = this.fallbackPayload[input.templateName];
                }
            }
            
        }
    }

    private registerEventEmitters() {
        for(const output of this._outputs) {
            this._componentRef.instance[output.propName].pipe(takeUntil(this._destroy$)).subscribe((data: any) => {
                if(!isNoU(data)) {
                    if(this._isMicrofrontendLoaded)
                        this.event.emit({ name: output.templateName, payload: data });
                    else
                        this.fallbackEvent.emit({ name: output.templateName, payload: data });
                } else {
                    if(this._isMicrofrontendLoaded)
                        this.event.emit({ name: output.templateName });
                    else
                        this.fallbackEvent.emit({ name: output.templateName });
                }
            });
        }
    }

    private createComponent(component: Type<any>) {
        const mirror = reflectComponentType(component);
        this._contentSelectors = mirror.ngContentSelectors;
        this._inputs = mirror.inputs;
        this._outputs = mirror.outputs;
        const projectableNodes = this.getProjectableNodes();
        this._componentRef = this._target.createComponent(component, { index: 0, projectableNodes: projectableNodes });
        this.updateParams();
        this.registerEventEmitters();
    }

    /**
     * Returns projectable nodes array necessary for passing content to the component created dynamically
     */
    private getProjectableNodes(): any[][] {
        let projectableNodes = [];
        if(this._contentSelectors.length) {
            const viewContentRef = this._content.createEmbeddedView(null);
            this._contentNodes = Array.from(viewContentRef.rootNodes);
            projectableNodes = this._contentSelectors.map(() => []);
            const wildcardIndex = this._contentSelectors.findIndex((selector) => selector === '*');
            this._contentNodes.forEach((node) => {
                if(node instanceof Element) {
                    const selectorIndex = this._contentSelectors.findIndex((selector, i) => i !== wildcardIndex && node.matches(selector));
                    if(selectorIndex !== -1) {
                        projectableNodes[selectorIndex].push(node);
                        return;
                    }
                } 
                if(wildcardIndex > -1) {
                    projectableNodes[wildcardIndex].push(node);
                }
            });
        }
        return projectableNodes;
    }

    private getSimpleChangesFromPayload(change: SimpleChange) {
        const simpleChanges: SimpleChanges = {};
        Object.keys(change.currentValue).forEach(inputName => {
            let input = this._inputs.find((input) => input.templateName === inputName);
            if(input && change.currentValue[inputName] !== change.previousValue?.[inputName])
                simpleChanges[input.propName] = new SimpleChange(change.previousValue?.[inputName], change.currentValue[inputName], change.firstChange);
        });
        return simpleChanges;
    }

}