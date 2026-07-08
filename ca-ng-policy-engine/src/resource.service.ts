import { Injectable } from '@angular/core';
import { MetadataHelpers } from '@ca-webstack/reflection';
import { ResourceKey, IResourceParams } from './resource.decorator';

/**
 * Helper class that permits resource metadata extraction from an entity or a prop.
 *
 * ### Example
 * ```
 * import { ResourceService } from 'ca-ng-policy-engine/core'
 *
 * class MyComponent {
 *   public constructor (
 *     private _resourceService: ResourceService
 *   ) { }
 *
 *   // use resourceService
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  /**
   * Extract resource metadata from an entity or a prop.
   *
   * @param model - Class or instance from which to extract resource metadata.
   * @param prop - Prop from which to extract resource metadata.
   * @return resource metadata.
   *
   * ### Example
   * ```
   * @Resource({
   *   uri: 'model://app1/domain1/task1/persona'
   * })
   * class Person {
   *   private _firstName: string;
   *
   *   @Resource({
   *     uri: 'model://app1/domain1/task1/persona/first-name'
   *   })
   *   public get firstName() { return this._firstName; }
   *   public set firstName(value: string) { this._firstName = value; }
   * }
   *
   * let resource = resourceService.getResource(Person);
   * // resource === { uri: 'model://app1/domain1/task1/persona' }
   *
   * // - or -
   *
   * let resource = resourceService.getResource(Person, 'firstName');
   * // resource === { uri: 'model://app1/domain1/task1/persona/first-name' }
   *
   * // - or -
   *
   * let person = new Person();
   * let resource = resourceService.getResource(person);
   * // resource === { uri: 'model://app1/domain1/task1/persona' }
   *
   * // - or -
   *
   * let person = new Person();
   * let resource = resourceService.getResource(person, 'firstName');
   * // resource === { uri: 'model://app1/domain1/task1/persona/first-name' }
   * ```
   */
  public getResource(model: any, prop?: string) {
    return MetadataHelpers.getMetadata<IResourceParams>(ResourceKey, model, prop, { inheritParentMetadata: true });
  }

}
