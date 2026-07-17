import { Injectable, PipeTransform } from '@angular/core';
import { MetadataHelpers } from '@ca-webstack/reflection';
import { IAspectParams, AspectKey } from '../decorators/index';
import { Context } from '../models/index';

/**
 * Helper class that permits aspect metadata extraction from an entity.
 *
 * ### Example
 * ```
 * import {AspectHelper} from 'cang2shell/services'
 *
 * class MyComponent {
 *   public constructor (
 *     private aspectHelper: AspectHelper
 *   ) { }
 *
 *   // use aspectHelper
 * }
 * ```
 */
@Injectable()
export class AspectHelper {

  /**
   * Extract aspect metadata from an entity.
   *
   * @param model - Class or instance from which to extract aspect metadata.
   * @param prop - Prop from which to extract aspect metadata.
   * @return Aspect metadata.
   *
   * ### Example
   * ```
   * class Person {
   *   private _firstName: string;
   *
   *   @Aspect({
   *     default: {
   *       label: 'Name',
   *       template: 'sh-text'
   *     },
   *     browse: {
   *       converters: [UpperCasePipe]
   *     },
   *     edit: {
   *       label: 'First name'
   *     }
   *   })
   *   public get firstName() { return this._firstName; }
   *   public set firstName(value: string) { this._firstName = value; }
   * }
   *
   * let aspect = aspectHelper.getAspect(Person, 'firstName');
   * // aspect === {default: {label: 'Name', template: 'sh-text}, browse: {converters: [UpperCasePipe]}, edit: {label: 'First name'}}
   *
   * // - or -
   *
   * let person = new Person();
   * let aspect = aspectHelper.getAspect(person, 'firstName');
   * // aspect === {default: {label: 'Name', template: 'sh-text}, browse: {converters: [UpperCasePipe]}, edit: {label: 'First name'}}
   * ```
   */
  public getAspect(model: any, prop?: string) {
    return MetadataHelpers.getMetadata<IAspectParams>(AspectKey, model, prop, { inheritParentMetadata: true });
  }

  /**
   * Extract label from aspect metadata.
   *
   * @param model - Class or instance from which to extract label.
   * @param prop - Prop from which to extract label.
   * @param context - View context.
   * @return property label.
   *
   * ### Example
   * ```
   * class Person {
   *   private _firstName: string;
   *
   *   @Aspect({
   *     default: {
   *       label: 'Name'
   *     },
   *     browse: {
   *       label: 'First name'
   *     }
   *   })
   *   public get firstName() { return this._firstName; }
   *   public set firstName(value: string) { this._firstName = value; }
   * }
   *
   * let label = aspectHelper.getLabel(Person, 'firstName');
   * // label === 'Name'
   *
   * // - or -
   *
   * let label = aspectHelper.getLabel(Person, 'firstName', Context.browse);
   * // label === 'First name'
   *
   * // - or -
   *
   * let person = new Person();
   * let label = aspectHelper.getLabel(person, 'firstName');
   * // label === 'Name'
   *
   * // - or -
   *
   * let person = new Person();
   * let label = aspectHelper.getLabel(person, 'firstName', Context.browse);
   * // label === 'First name'
   * ```
   */
  public getLabel(model: any, prop: string, context?: Context) {
    return this.getMeta<string>(model, prop, context, 'label');
  }

  /**
   * Extract template from aspect metadata.
   *
   * @param model - Class or instance from which to extract template.
   * @param prop - Prop from which to extract template.
   * @param context - View context.
   * @return property template.
   *
   * ### Example
   * ```
   * class Person {
   *   private _firstName: string;
   *
   *   @Aspect({
   *     default: {
   *       template: 'sh-text'
   *     },
   *     browse: {
   *       template: 'sh-text-view'
   *     }
   *   })
   *   public get firstName() { return this._firstName; }
   *   public set firstName(value: string) { this._firstName = value; }
   * }
   *
   * let template = aspectHelper.getTemplate(Person, 'firstName');
   * // template === 'sh-text'
   *
   * // - or -
   *
   * let template = aspectHelper.getTemplate(Person, 'firstName', Context.browse);
   * // template === 'sh-text-view'
   *
   * // - or -
   *
   * let person = new Person();
   * let template = aspectHelper.getTemplate(person, 'firstName');
   * // template === 'sh-text'
   *
   * // - or -
   *
   * let person = new Person();
   * let template = aspectHelper.getTemplate(person, 'firstName', Context.browse);
   * // template === 'sh-text-view'
   * ```
   */
  public getTemplate(model: any, prop: string, context?: Context) {
    return this.getMeta<string>(model, prop, context, 'template');
  }

  /**
   * Extract converters from aspect metadata.
   *
   * @param model - Class or instance from which to extract template.
   * @param prop - Prop from which to extract template.
   * @param context - View context.
   * @return property template.
   *
   * ### Example
   * ```
   * class Person {
   *   private _firstName: string;
   *
   *   @Aspect({
   *     default: {
   *       converters: UpperCasePipe
   *     },
   *     browse: {
   *       converters: LowerCasePipe
   *     }
   *   })
   *   public get firstName() { return this._firstName; }
   *   public set firstName(value: string) { this._firstName = value; }
   * }
   *
   * let converter = aspectHelper.getConverters(Person, 'firstName');
   * // converter instanceof UpperCasePipe
   *
   * // - or -
   *
   * let converter = aspectHelper.getConverters(Person, 'firstName', Context.browse);
   * // converter instanceof LowerCasePipe
   *
   * // - or -
   *
   * let person = new Person();
   * let converter = aspectHelper.getConverters(person, 'firstName');
   * // converter instanceof UpperCasePipe
   *
   * // - or -
   *
   * let person = new Person();
   * let converter = aspectHelper.getConverters(person, 'firstName', Context.browse);
   * // converter instanceof LowerCasePipe
   * ```
   */
  public getConverters(model: any, prop: string, context?: Context): PipeTransform | Array<PipeTransform> {
    let meta = this.getMeta<any | Array<any>>(model, prop, context, 'converters');
    if (meta instanceof Array) {
      return meta.map((item: any) => new item());
    } else if (meta) {
      return new meta();
    } else {
      return;
    }
  }

  private getMeta<T>(model: any, prop: string, context: Context, metaKey: string) {
    let ctx = Context[context] || 'default';
    let meta: any = this.getAspect(model, prop);
    if (meta) {
      return meta[ctx] && meta[ctx][metaKey] ? <T>meta[ctx][metaKey] : <T>meta['default'][metaKey];
    }
    return;
  }
}
