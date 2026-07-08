import { Type } from '@angular/core';

export const CaepContentChildKey = 'content-child';

/**
 * Description of mapping  property name-metadata
 */
export interface ICaepContentChildMapping {
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
  };
}

/**
 * Decorator useful for defining metadata to adotpt for assigning correct value to properties marked with Angular @ContentChild decorator when control is created dynamically with CaepFormControlComponent.
 *
 * @param selector The component type
 *
 * ### Example
 * ```
 * @CaepContentChild(SampleComponent)
 * @ContentChild(SampleComponent)
 * public contentValue: SampleComponent;
 * ```
 */
export function CaepContentChild(selector: Type<unknown>) {
  return function (target: any, targetKey: string) {
    let existingContentChildMappings: ICaepContentChildMapping[] =
      Reflect.getMetadata(CaepContentChildKey, target) || [];
    existingContentChildMappings.push({ targetKey, metadata: { selector /*, opts*/ } } as ICaepContentChildMapping);
    Reflect.defineMetadata(CaepContentChildKey, existingContentChildMappings, target);
    //ContentChild(selector, opts)(target, targetKey);
  };
}
