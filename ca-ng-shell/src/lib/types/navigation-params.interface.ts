import { IActivityPayload } from './activity-payload.interface';

export interface INavigationParams<TPayload extends IActivityPayload> {
  payload: TPayload;
  currentState: string | string[];
  newState: string | string[];
}
