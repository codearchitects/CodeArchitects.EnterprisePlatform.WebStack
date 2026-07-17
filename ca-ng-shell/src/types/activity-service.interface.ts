import { IActivityPayload } from './activity-payload.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { CommandDispatcherService } from '@ca-webstack/ng-command-dispatcher';
import { Activity } from '../components/activity';

export interface IActivityService<TPayload extends IActivityPayload, TActivity extends Activity<TPayload>, TDelegates> {
  activity: TActivity;
  delegates: TDelegates;
  router: Router;
  activatedRoute: ActivatedRoute;
  commandDispatcher: CommandDispatcherService;
}
