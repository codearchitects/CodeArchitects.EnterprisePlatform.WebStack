import { Component } from '@angular/core';
import { FormEnhancer, VB6Helpers, VB6Error, MsgBoxStyle, Ref, IRef } from '@ca-webstack/vb6-library';
import { reverse } from 'dns';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'fixtures';

  public useFormEnhancer() {
    FormEnhancer.Frm.foo = 'bar';
    return FormEnhancer.Frm.foo === 'bar';
  }

  public useVB6Helpers() {
    const foo = 'bar';
    const uppercaseFoo = VB6Helpers.UCase(foo);
    return uppercaseFoo === foo.toUpperCase();
  }

  public useRef() {
    const foo = { bar: 'foobar' };
    const ref = new Ref(foo, 'bar');
    ref.value = 'foo';
    return foo.bar === ref.value;
  }
}
