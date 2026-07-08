import { ChangeDetectorRef, Injectable, Pipe, Inject } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Injectable()
@Pipe({
    name: 'translate',
    pure: false, // required to update the value when the promise is resolved
    standalone: false
})
export class ShTranslatePipe extends TranslatePipe {

  constructor(translate: TranslateService, ref: ChangeDetectorRef) {
    super(translate, ref);
  }

}