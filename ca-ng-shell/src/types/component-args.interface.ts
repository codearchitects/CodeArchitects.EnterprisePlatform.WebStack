import { IMetadataArgs } from '@ca-webstack/reflection';

/**
 * Application component decorator arguments
 */
export interface IApplicationComponentArgs extends IMetadataArgs {
  application: string;
  shortDescription: string;
}

/**
 * Domain component decorator arguments
 */
export interface IDomainComponentArgs extends IMetadataArgs {
  application: string;
  domain: string;
  shortDescription: string;
}

/**
 * Task component decorator arguments
 */
export interface ITaskComponentArgs extends IMetadataArgs {
  application: string;
  domain: string;
  task: string;
  shortDescription: string;
}

/**
 * Activity component decorator arguments
 */
export interface IActivityComponentArgs extends IMetadataArgs {
  application?: string;
  domain?: string;
  task?: string;
  shortDescription?: string;
  path?: string | string[];
  order?: number;
  canActivate?: boolean;
  canDeactivate?: boolean;
  properties?: { [key: string]: any };
}
