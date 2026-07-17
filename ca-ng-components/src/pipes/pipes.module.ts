import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ShBreadcrumbPipe } from './breadcrumb.pipe';
import { ShDayPipe } from './day.pipe';
import { ExtendedCountryPipe } from './extended-country.pipe';
import { ShHourPipe } from './hour.pipe';
import { InitialsPipe } from './initials.pipe';
import { ShInterpretPipe } from './interpret.pipe';
import { ISOCountryPipe } from './iso-country.pipe';
import { ShMinutesPipe } from './minutes.pipe';
import { ShMonthPipe } from './month.pipe';
import { ShYearPipe } from './year.pipe';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  declarations: [ShBreadcrumbPipe, ShInterpretPipe, ShDayPipe, ShMinutesPipe, ShHourPipe, ShMonthPipe, ShYearPipe, InitialsPipe, ISOCountryPipe, ExtendedCountryPipe],
  exports: [ShBreadcrumbPipe, ShInterpretPipe, ShDayPipe, ShMinutesPipe, ShHourPipe, ShMonthPipe, ShYearPipe, InitialsPipe, ISOCountryPipe, ExtendedCountryPipe]
})
export class ShPipesModule { }
