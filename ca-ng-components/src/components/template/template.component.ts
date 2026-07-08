import { Component, ComponentRef, Injector, OnChanges, OnInit, SimpleChanges, ViewChild, ViewContainerRef, ElementRef } from '@angular/core';
import { AspectHelper, ContextService } from '@ca-webstack/ng-aspects';
import { TemplateMapperService } from '../../services/template-mapper.service';
import { IShBaseInputOptions, IShBaseOptions, ShBaseInputComponent, ShBaseModelComponent } from '../base/index';

@Component({
    selector: 'sh-template',
    template: '<div #target></div>',
    standalone: false
})
/**
 * Component which reads aspect decorator and applies
 * template dynamically
 */
export class ShTemplateComponent<T, C extends ShBaseInputComponent<T, IShBaseInputOptions<T>>>
  extends ShBaseModelComponent<T, IShBaseOptions>
  implements OnChanges, OnInit {
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
  private _templateMapper: TemplateMapperService;
  /**
   * References to target element
   */
  @ViewChild('target', { read: ViewContainerRef, static: true })
  private _target: ViewContainerRef;
  /**
   * References to component element
   */
  private _element: ElementRef;
  /**
   * References to component
   */
  private _componentRef: ComponentRef<C>;

  /**
   * Component which reads aspect decorator and applies
   * template dynamically
   */
  constructor(injector: Injector) {
    super(injector);
    this._aspectHelper = injector.get(AspectHelper);
    this._templateMapper = injector.get(TemplateMapperService);
    this._contextService = injector.get(ContextService);
    this._element = injector.get(ElementRef);
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (this._componentRef) {
      this.updateParams();
      this._componentRef.instance.ngOnChanges(changes);
    }
  }

  ngOnInit() {
    super.ngOnInit();
    const templateName = this._aspectHelper.getTemplate(this.model, this.prop, this._contextService.context);
    const template = this._templateMapper.findTemplateByName(templateName);
    this.markContainer(templateName);
    this._componentRef = this._target.createComponent(template);
    this.updateParams();
  }

  public giveFocus() {
    this._componentRef.instance.giveFocus();
  }

  /**
   * Updates instance component params
   */
  private updateParams() {
    this._componentRef.instance.model = this.model;
    this._componentRef.instance.prop = this.prop;
    this._componentRef.instance.enable = this.enable;
    this._componentRef.instance.show = this.show;
    this._componentRef.instance.valueChanges = this.valueChanges;
    this._componentRef.instance.options = this.internalOptions;
  }

  /**
   * Marks sh-template parent container with the component name
   * if it uses the "component" attribute
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
}
