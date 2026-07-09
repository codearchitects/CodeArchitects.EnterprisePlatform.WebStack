import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule } from '@ca-webstack/ng-i18n';
import { TranslateModule } from '@ngx-translate/core';
import { CaepTranslateMstringPipe } from './caep-translate-mstring.pipe';
import { CaepNumeralPipe } from './numeral.pipe';

@NgModule({
  imports: [CommonModule, I18nModule, TranslateModule],
  declarations: [CaepNumeralPipe, CaepTranslateMstringPipe],
  exports: [CaepNumeralPipe, CaepTranslateMstringPipe]
})
export class CaepPipesModule {}
