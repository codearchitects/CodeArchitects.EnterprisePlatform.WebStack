import { MetadataHelpers } from '@ca-webstack/reflection';

export const ResourceKey = 'resource';

export interface IResourceParams {
  uri: string;
}

/**
 * Decorator useful to describe resource metadata for policy-engine purpose.
 * If added, resource decorator must specify the uri of a resource.
 *
 * @type params - Aspect description.
 *
 * ### Example
 * ```
 * @Resource({
 *   uri: 'model://app1/domain1/task1/person
 * })
 * class Person {
 *   private _firstName: string;
 *
 *   @Resource({
 *     uri: 'model://app1/domain1/task1/person/first-name
 *   })
 *   public get firstName() { return this._firstName; }
 *   public set firstName(value: string) { this._firstName = value; }
 * }
 * ```
 */
export function Resource(params: IResourceParams) {
  return MetadataHelpers.defineMetadata(ResourceKey, params);
}
