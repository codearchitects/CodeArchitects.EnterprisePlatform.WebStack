import { Type } from '@angular/core';
import { ShCaptionComponent } from '../components/caption/caption.component';
import { ShCheckgroupComponent } from '../components/checkgroup/checkgroup.component';
import { ShCurrencyComponent } from '../components/currency/currency.component';
import { ShNumberComponent } from '../components/number/number.component';
import { ShPercentComponent } from '../components/percent/percent.component';
import { ShTextareaComponent } from '../components/textarea/textarea.component';
import { ShCheckboxComponent } from './../components/checkbox/checkbox.component';
import { ShComboComponent } from './../components/combo/combo.component';
import { ShDateTimeComponent } from './../components/date-time/date-time.component';
import { ShDateComponent } from './../components/date/date.component';
import { ShMultiSelectComponent } from './../components/multiselect/multiselect.component';
import { ShRadioComponent } from './../components/radio/radio.component';
import { ShSelectComponent } from './../components/select/select.component';
import { ShSliderComponent } from 'src/components/slider/slider.component';
import { ShTextComponent } from './../components/text/text.component';
import { ShTimeComponent } from './../components/time/time.component';
import { ShToggleComponent } from './../components/toggle/toggle.component';

export class TemplateDictionary {
  [key: string]: Type<any>;
}

export const ShTemplate: TemplateDictionary = {
  CAPTION: ShCaptionComponent,
  CHECKBOX: ShCheckboxComponent,
  CHECKGROUP: ShCheckgroupComponent,
  COMBO: ShComboComponent,
  CURRENCY: ShCurrencyComponent,
  DATE: ShDateComponent,
  DATETIME: ShDateTimeComponent,
  MULTISELECT: ShMultiSelectComponent,
  NUMBER: ShNumberComponent,
  PERCENT: ShPercentComponent,
  RADIO: ShRadioComponent,
  SELECT: ShSelectComponent,
  SLIDER: ShSliderComponent,
  TEXT: ShTextComponent,
  TEXTAREA: ShTextareaComponent,
  TIME: ShTimeComponent,
  TOGGLE: ShToggleComponent
};
