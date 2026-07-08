import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ShTranslateModule } from '../i18n/translate.module';
import { ShBreadcrumbPipe } from './breadcrumb.pipe';
import { ShDayPipe } from './day.pipe';
import { ShHourPipe } from './hour.pipe';
import { ShInterpretPipe } from './interpret.pipe';
import { ShMinutesPipe } from './minutes.pipe';
import { ShMonthPipe } from './month.pipe';
import { ShYearPipe } from './year.pipe';
import { NumeralPipe } from './numeral.pipe';

@NgModule({
  imports: [
    CommonModule,
    ShTranslateModule
  ],
  declarations: [ShBreadcrumbPipe, ShInterpretPipe, ShDayPipe, ShMinutesPipe, ShHourPipe, ShMonthPipe, ShYearPipe, NumeralPipe],
  exports: [ShBreadcrumbPipe, ShInterpretPipe, ShDayPipe, ShMinutesPipe, ShHourPipe, ShMonthPipe, ShYearPipe, NumeralPipe]
})
export class ShPipesModule { }
