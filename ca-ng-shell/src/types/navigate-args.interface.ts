import { IActivityPayload } from './activity-payload.interface';
import { Activity } from '../components/activity';
import { BaseDelegates } from '../services/base-delegate.service';

export interface INavigateArgs {
  root?: boolean;
  application?: string | any[];
  domain?: string | any[];
  scenario?: string | any[];
  action?: string | any[];
  delegates?: BaseDelegates;
  label?: string;
  activity?: Activity<IActivityPayload>;
  distance?: number;
  withReturn?: boolean;
  input?: any;
  output?: any;
  isUnwinding?: boolean;
}
