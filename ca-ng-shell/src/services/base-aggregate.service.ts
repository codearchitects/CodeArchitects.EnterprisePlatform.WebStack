import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { INotifyPropertyChanged } from '@ca-webstack/change-tracker';
import { BaseDelegates } from './base-delegate.service';
import { IActivityPayload, INavigateArgs } from '../types/index';
import { ActionShellComponent } from '../components/action.shell.component';
import { Activity } from '../components/activity';

export class BaseAggregateService<TPayload extends IActivityPayload,
  TActivity extends Activity<TPayload>, TDelegates extends BaseDelegates> {

  constructor(
    protected component: ActionShellComponent<TPayload, TActivity, TDelegates>
  ) { }

  public get payload(): TPayload {
    return this.component.payload;
  }

  public get delegates(): TDelegates {
    return this.component.delegates;
  }

  public get activity(): TActivity {
    return this.component.activity;
  }

  public navigate(args: INavigateArgs): Observable<boolean> {
    return this.component.navigate(args);
  }

  protected get subscribeEvent(): (name: string, callback: (...msg: any[]) => void) => void {
    return (<any>this.component)['subscribeEvent'];
  }

  protected get observe(): (observable: INotifyPropertyChanged, propertyName: string,
    callback: (value: any) => void, timeout?: number) => void {
    return (<any>this.component)['observe'];
  }

  protected get multipleObserve(): (observable: INotifyPropertyChanged,
    callback: (...value: any[]) => void, timeout?: number, ...propertyNames: string[]) => void {
    return (<any>this.component)['multipleObserve'];
  }

  protected get formGroup(): FormGroup {
    return (<any>this.component)['formGroup'];
  }

  protected get options(): any {
    return {
      applicationName: (<any>this.component)['applicationName'],
      domainName: (<any>this.component)['domainName'],
      scenarioName: (<any>this.component)['scenarioName'],
      actionName: (<any>this.component)['actionName']
    };
  }

  protected setAnnotation(key: string, title: string, isNavigable = true,
    isDraft = false, data?: { [key: string]: any }, info?: { [key: string]: any }) {
    const annotation = {
      title: title, isNavigable: isNavigable, key: this.getAnnotationKey(key),
      isDraft: isDraft, data: data, info: info
    };
    (<any>this.component)['activity'].setAnnotation(annotation);
  }

  protected getAnnotationKey(paramsKey: string): string {
    return `${this.options.applicationName}/${this.options.domainName}/${this.options.scenarioName}`
      + `/${(<any>this.component).activity.taskId}/${this.options.actionName}/${paramsKey}`;
  }

}
