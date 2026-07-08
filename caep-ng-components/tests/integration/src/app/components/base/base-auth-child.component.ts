import { Component, Injector } from '@angular/core';
import { CaepBaseAuthComponent, CaepHook, CaepHookType } from '@caep/ng-components';

@Component({
    selector: 'app-base-auth-child',
    template: `
    @if (show) {
      <button [attr.tabindex]="tabindex" type="button"
      [id]="id" [class]="containerClass"
      [attr.autofocus]="autofocus || null" [disabled]="!enable">Button</button>
    }
    `,
    standalone: false
})
export class BaseAuthChildComponent extends CaepBaseAuthComponent {

  constructor(injector: Injector) {
    super(injector);
  }

  @CaepHook({ type: CaepHookType.Init, priority: 1 })
  private myMethod1() {
    console.log('-------------------------Method1')
  }

  @CaepHook({ type: CaepHookType.Init, priority: 1 })
  public myMethod2() {
    console.log('-------------------------Method2')
  }

  @CaepHook({ type: CaepHookType.Init, priority: 3 })
  protected myMethod3() {
    console.log('-------------------------Method3')
  }

}