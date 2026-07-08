import { Type } from '@angular/core';

export const CaepContentChildrenKey = 'content-children';

/**
 * Description of mapping  property name-metadata
 */
export interface ICaepContentChildrenMapping {
  /**
   * Name of the decorated property
   */
  targetKey: string;

  /**
   * Saved metadata of the decorated property
   */
  metadata: {
    /**
     * The component type
     */
    selector: Type<unknown>;

    /**
     * Custom options
     */
    opts?: {
      /**
       * If true include all descendants of the element. If false then only query direct children of the element.
       */
      descendants?: boolean;
    };
  };
}

/**
 * Decorator useful for defining metadata to adotpt for assigning correct values to properties marked with Angular @ContentChildren decorator when control is created dynamically with CaepFormControlComponent.
 *
 * @param selector The component type
 * @param opts Custom options
 *
 * ### Example
 * ```
 * @CaepContentChildren(SampleComponent)
 * @ContentChildren(SampleComponent)
 * public contentValues: QueryList<SampleComponent>;
 * ```
 */
export function CaepContentChildren(
  selector: Type<unknown>,
  opts: {
    descendants?: boolean;
  } = {
    descendants: false
  }
) {
  return function (target: any, targetKey: string) {
    let existingContentChildrenMappings: ICaepContentChildrenMapping[] =
      Reflect.getMetadata(CaepContentChildrenKey, target) || [];
    existingContentChildrenMappings.push({ targetKey, metadata: { selector, opts } } as ICaepContentChildrenMapping);
    Reflect.defineMetadata(CaepContentChildrenKey, existingContentChildrenMappings, target);
    //ContentChildren(selector, opts)(target, targetKey);
  };
}
