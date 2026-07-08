import {
  Component,
  ComponentRef,
  ElementRef,
  Injector,
  SimpleChanges,
  TemplateRef,
  Type,
  ViewChild,
  ViewContainerRef,
  reflectComponentType
} from '@angular/core';
import { AspectHelper, ContextService } from '@ca-webstack/ng-aspects';
import * as _ from 'lodash-es';
import { takeUntil } from 'rxjs/operators';
import {
  CaepContentChildKey,
  CaepContentChildrenKey,
  CaepHook,
  CaepHookType,
  ICaepContentChildMapping,
  ICaepContentChildrenMapping
} from '../../decorators';
import { CaepTemplateMapperService } from '../../services/template-mapper.service';
import { CaepBaseModelComponent } from '../base';

/**
 * Component which reads aspect decorator and applies
 * template dynamically
 */
@Component({
    selector: 'caep-template',
    template: `
    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>
    <ng-container #target> </ng-container>
  `,
    standalone: false
})
export class CaepTemplateComponent<T, C extends CaepBaseModelComponent<T>> extends CaepBaseModelComponent<T> {
  /**
   * Context Service
   */
  private _contextService: ContextService;

  /**
   * Aspect Helpers
   */
  private _aspectHelper: AspectHelper;

  /**
   * Template mapper service
   */
  private _templateMapper: CaepTemplateMapperService;

  /**
   * References to target element
   */
  @ViewChild('target', { read: ViewContainerRef, static: true })
  private _target: ViewContainerRef;

  /**
   * Template reference
   */
  @ViewChild('content', { read: TemplateRef, static: true })
  private _content: TemplateRef<any>;

  /**
   * References to component element
   */
  private _element: ElementRef;

  /**
   * References to component
   */
  private _componentRef: ComponentRef<C>;

  /**
   * Nodes passed as content to the component using content projection
   */
  private _contentNodes: any[] = [];

  /**
   * ngContentSelectors of the component to create
   */
  private _contentSelectors: readonly string[];

  /**
   * Flag for creating template in ngOnChanges lifecycle hook
   */
  private _firstChange = true;

  /**
   * Component which reads aspect decorator and applies
   * template dynamically
   */
  constructor(injector: Injector) {
    super(injector);
    this._aspectHelper = injector.get(AspectHelper);
    this._templateMapper = injector.get(CaepTemplateMapperService);
    this._contextService = injector.get(ContextService);
    this._element = injector.get(ElementRef);
  }

  public giveFocus() {
    this._componentRef.instance.giveFocus();
  }

  /**
   * Creates template on first run and updates component params
   * @param changes SimpleChanges object containing input changes
   */
  @CaepHook({ type: CaepHookType.Change, priority: 1 })
  private updateTemplate(changes: SimpleChanges) {
    if (this._firstChange) {
      this.createTemplate();
      this._firstChange = false;
    } else {
      this.updateParams();
    }
    this._componentRef.instance.ngOnChanges(changes);
  }

  @CaepHook({ type: CaepHookType.Init, priority: 1 })
  private initializeTemplate() {
    if (this._firstChange) {
      this.createTemplate();
      this._firstChange = false;
    }
  }

  /**
   * Creates component dynamically from template specified in the @Aspect decorator and initializes contentSelectors
   */
  private createTemplate() {
    const templateName = this._aspectHelper.getTemplate(this.model, this.prop, this._contextService.context);
    const template = this._templateMapper.findTemplateByName(templateName);
    this.markContainer(templateName);
    this._contentSelectors = this.getComponentMirror(template).ngContentSelectors;
    const projectableNodes = this.getProjectableNodes();
    this._componentRef = this._target.createComponent<C>(template, { index: 0, injector: this.injector, projectableNodes });
    this.updateParams();
    if (this._contentSelectors.length) {
      this._componentRef.instance.afterContentInitCall$.pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.updateContentChildReferences();
        this.updateContentChildrenReferences();
      });
    }
  }

  /**
   * Updates content nodes and content child/content children references when nodes passed as content change
   */
  @CaepHook({ type: CaepHookType.DoCheck })
  private updateContentNodes() {
    if (this._contentSelectors.length) {
      const viewContentRef = this._content.createEmbeddedView(null);
      const nodes = Array.from(viewContentRef.rootNodes);
      if (nodes.length !== this._contentNodes.length || !_.isEqual(nodes, this._contentNodes)) {
        this._contentNodes = nodes;
        this.updateContentChildReferences();
        this.updateContentChildrenReferences(true);
      }
    }
  }

  /**
   * Updates instance component params
   */
  private updateParams() {
    this._componentRef.instance.model = this.model;
    this._componentRef.instance.prop = this.prop;
    this._componentRef.instance.enable = this.enable;
    this._componentRef.instance.show = this.show;
    this._componentRef.instance.hostOptions = { ...this.options };
    this._componentRef.instance.id = this.id;
    this._componentRef.instance.tabindex = this.tabindex;
    this._componentRef.instance.autofocus = this.autofocus;
    this._componentRef.instance.label = this.label;
    this._componentRef.instance.width = this.width;
    this._componentRef.instance.height = this.height;
    this._componentRef.instance.containerClass = this.containerClass;
    this._componentRef.instance.tooltip = this.tooltip;
    this._componentRef.instance.resource = this.resource;
    this._componentRef.instance.selectors = this.selectors;
    this._componentRef.instance.valueChanges = this.valueChanges;
    this._componentRef.instance.canValueChange = this.canValueChange;
    this._componentRef.instance.keypressed = this.keypressed;
    this._componentRef.instance.keydowned = this.keydowned;
    this._componentRef.instance.keyupped = this.keyupped;
    this._componentRef.instance.clicked = this.clicked;
    this._componentRef.instance.dblclicked = this.dblclicked;
    this._componentRef.instance.focused = this.focused;
    this._componentRef.instance.blurred = this.blurred;
    this._componentRef.instance.mousemoved = this.mousemoved;
  }

  /**
   * Marks caep-template parent container with the component name if it uses the "component" attribute
   * @param templateName The name of the component
   */
  private markContainer(templateName: string) {
    const container = this._element.nativeElement.parentElement as HTMLElement;
    if (container) {
      const attr = 'component';
      if (container.hasAttribute(attr)) {
        container.setAttribute(attr, templateName);
      }
    }
  }

  /**
   * Returns projectable nodes array necessary for passing content to the component created dynamically
   */
  private getProjectableNodes(): any[][] {
    let projectableNodes = [];
    if (this._contentSelectors.length) {
      const viewContentRef = this._content.createEmbeddedView(null);
      this._contentNodes = Array.from(viewContentRef.rootNodes);
      projectableNodes = this._contentSelectors.map(() => []);
      const wildcardIndex = this._contentSelectors.findIndex(selector => selector === '*');
      this._contentNodes.forEach(node => {
        if (node instanceof Element) {
          const selectorIndex = this._contentSelectors.findIndex(
            (selector, i) => i !== wildcardIndex && node.matches(selector)
          );
          if (selectorIndex !== -1) {
            projectableNodes[selectorIndex].push(node);
            return;
          }
        }
        if (wildcardIndex > -1) {
          projectableNodes[wildcardIndex].push(node);
        }
      });
    }
    return projectableNodes;
  }

  /**
   * Updates properties marked with @CaepContentChild decorator
   */
  private updateContentChildReferences() {
    const contentChildMappings: ICaepContentChildMapping[] = Reflect.getMetadata(
      CaepContentChildKey,
      this._componentRef.instance
    );
    if (contentChildMappings) {
      for (const mapping of contentChildMappings) {
        if (mapping.metadata.selector) {
          let ngComponent;
          for (const node of this._contentNodes) {
            if (node instanceof Element) {
              const component = (node as any).component || this.getComponentFromDescendants(node);
              if (component instanceof mapping.metadata.selector) {
                ngComponent = component;
                break;
              }
            }
          }
          this._componentRef.instance[mapping.targetKey] = ngComponent;
        }
      }
    }
  }

  /**
   * Updates properties marked with @CaepContentChildren decorator
   * @param shouldEmitChange If true it notifies on query list after resetting its values
   */
  private updateContentChildrenReferences(shouldEmitChange = false) {
    const contentChildrenMappings: ICaepContentChildrenMapping[] = Reflect.getMetadata(
      CaepContentChildrenKey,
      this._componentRef.instance
    );
    if (contentChildrenMappings) {
      for (const mapping of contentChildrenMappings) {
        if (mapping.metadata.selector) {
          const ngComponents = [];
          this._contentNodes.forEach(node => {
            if (node instanceof Element) {
              const component = mapping.metadata.opts.descendants
                ? (node as any).component || this.getComponentFromDescendants(node)
                : (node as any).component;
              if (component instanceof mapping.metadata.selector) ngComponents.push(component);
            }
          });
          this._componentRef.instance[mapping.targetKey].reset(ngComponents);
          if (shouldEmitChange) this._componentRef.instance[mapping.targetKey].notifyOnChanges();
        }
      }
    }
  }

  /**
   * Returns component instance searching on children of the passed element
   * @param element element to scan for component instance research
   */
  private getComponentFromDescendants(element: Element) {
    let component;
    const children = Array.from(element.children);
    for (const child of children) {
      if ((child as any).component) return (child as any).component;
      else if (child.children.length) {
        component = this.getComponentFromDescendants(child);
        if (component) break;
      }
    }
    return component;
  }

  /**
   * Returns component mirror
   * @param component component type
   */
  private getComponentMirror<T>(component: Type<T>) {
    return reflectComponentType(component);
  }
}
