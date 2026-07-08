import { Component, Injector, Input, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  CaepBaseModelComponent,
  CaepBaseOptions,
  CaepHook,
  CaepHookType,
  CaepOption,
  PickAll
} from '@caep/ng-components';
import * as _ from 'lodash-es';
import { from } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

export interface IBaseModelChildOptions extends PickAll<BaseModelChildOptions> {}

export class BaseModelChildOptions extends CaepBaseOptions {
  @CaepOption({ defaultValue: 'text' })
  type?: 'text' | 'password' | 'email';

  constructor(options?: IBaseModelChildOptions) {
    super(options);
  }
}

@Component({
    selector: 'app-base-model-child',
    template: `
    @if (show) {
      <input
        #controlRef
        [attr.autofocus]="autofocus || null"
        [attr.type]="options.type"
        [id]="id"
        [formControl]="formControl"
        [attr.tabindex]="tabindex"
        placeholder="Input"
        autocomplete="off"
        [style.minWidth]="width"
        [style.maxWidth]="width"
        [style.height]="height"
      />
    }
    `,
    standalone: false
})
export class BaseModelChildComponent extends CaepBaseModelComponent<string, BaseModelChildOptions> {
  formControl: FormControl;
  message = 'Hello World!';
  @Input() property: string;

  constructor(injector: Injector) {
    super(injector, (value?: IBaseModelChildOptions) => new BaseModelChildOptions(value));
  }

  /*ngOnInit() {
    super.ngOnInit();
    this.formControl = new FormControl('');
    from(this.formControl.valueChanges)
        .pipe(takeUntil(this.destroy$), distinctUntilChanged())
        .subscribe( () => {
          const value = this.formControl.value;
          if (!_.isEqual(this.getModelValue(), value)) {
            this.setModelValue(value);
          }
        });
  }*/

  @CaepHook({ type: CaepHookType.Init })
  private initializeFormControl() {
    console.log('---------InitializeFormControl');
    this.formControl = new FormControl('');
    from(this.formControl.valueChanges)
      .pipe(takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe(() => {
        const value = this.formControl.value;
        if (!_.isEqual(this.getModelValue(), value)) {
          this.setModelValue(value);
        }
      });
  }

  @CaepHook({ type: CaepHookType.Init, priority: 1 })
  private myMethod1() {
    console.log('-------------------------Method1');
  }

  @CaepHook({ type: CaepHookType.Init, priority: 1 })
  public myMethod2() {
    console.log('-------------------------Method2');
  }

  @CaepHook({ type: CaepHookType.Init, priority: 1, runBeforeSuper: true })
  private runBeforeSup() {
    console.log('-----------RunBeforeSuper1 - Message: ' + this.message);
  }

  @CaepHook({ type: CaepHookType.Init, priority: 3 })
  protected myMethod3() {
    console.log('-------------------------Method3');
  }

  @CaepHook({ type: CaepHookType.Init, priority: 2, runBeforeSuper: true })
  private runBeforeSup2() {
    console.log('-----------RunBeforeSuper2 - Message: ' + this.message);
  }

  @CaepHook({ type: CaepHookType.Init })
  private lastMethod() {
    console.log('-------------------------Last Method');
  }

  @CaepHook({ type: CaepHookType.Change })
  private onPropertyChange(changes: SimpleChanges) {
    console.log('---------OnPropertyChange');
    if (changes['property'])
      console.log('----------Change: ' + changes['property'].previousValue + ' - ' + changes['property'].currentValue);
  }

  @CaepHook({ type: CaepHookType.Destroy })
  private myMethod4() {
    console.log('------------Methhod4: DESTROY');
  }

  /*@CaepHook({ type: CaepHookType.Init, priority: 5 })
  protected overriddenMethod() {
    super.overriddenMethod();
    console.log('---------CaepBaseModel_overriddenMethod')
  }*/
}
