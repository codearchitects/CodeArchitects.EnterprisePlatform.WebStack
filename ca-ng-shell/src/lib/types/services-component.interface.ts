import { Router, ActivatedRoute } from '@angular/router';
import { CommandDispatcherService } from '@ca-webstack/ng-command-dispatcher';
import { Activity } from '../components/activity';
import { IActivityPayload } from './activity-payload.interface';

export interface IServicesComponent<TPayload extends IActivityPayload, TActivity extends Activity<TPayload>, TDelegates> {
  router: Router;
  activity: TActivity;
  delegates: TDelegates;
  activatedRoute: ActivatedRoute;
  commandDispatcher: CommandDispatcherService;
}
