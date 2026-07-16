import { ShMaskComponent } from './mask/mask.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { A11yModule } from '@angular/cdk/a11y';
import { I18nModule } from '@ca-webstack/ng-i18n';
import { PolicyEngineModule } from '@ca-webstack/ng-policy-engine';
import { AngularMyDatePickerModule } from '@nodro7/angular-mydatepicker';
import { ClickOutsideModule } from 'ng-click-outside';
import { ContextMenuModule } from '@perfectmemory/ngx-contextmenu';
import 'numeral/locales';
import { DEFAULT_NUMERAL } from '../pipes/numeral.pipe';
import { ShDirectivesModule } from '../directives/directives.module';
import { ShPipesModule } from '../pipes/pipes.module';
import { ShProgressBarPercentPipe } from '../pipes/progress-bar.pipe';
import { ShServicesModule } from '../services/services.module';
import {
  ShTemplate,
  TemplateDictionary
} from './../utilities/template-dictionary.utility';
import { ShBreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { ShButtonComponent } from './button/button.component';
import { ShCaptionComponent } from './caption/caption.component';
import { ShCardComponent } from './card/card.component';
import { ShCheckboxComponent } from './checkbox/checkbox.component';
import { ShCheckgroupComponent } from './checkgroup/checkgroup.component';
import { ShColumnComponent } from './column/column.component';
import { ShComboComponent } from './combo/combo.component';
import { ShCommandsBarComponent } from './commands-bar/commands-bar.component';
import { ShContainerComponent } from './container/container.component';
import { ShContextMenuItemComponent } from './context-menu-item/context-menu-item.component';
import { ShContextMenuComponent } from './context-menu/context-menu.component';
import { ShCurrencyComponent } from './currency/currency.component';
import { ShDateTimeComponent } from './date-time/date-time.component';
import { ShDateComponent } from './date/date.component';
import { ShFlexibleContentComponent } from './flexible-content/flexible-content.component';
import { ShFormArrayComponent } from './form-array/form-array.component';
import { ShFormControlComponent } from './form-control/form-control.component';
import { ShFormGroupComponent } from './form-group/form-group.component';
import { ShFormComponent } from './form/form.component';
import { ShHeaderComponent } from './header/header.component';
import { ShIconComponent } from './icon/icon.component';
import { ShLabelComponent } from './label/label.component';
import { ShModalComponent } from './modal/modal.component';
import { ShMultiSelectComponent } from './multiselect/multiselect.component';
import { ShNumberComponent } from './number/number.component';
import { ShOptionComponent } from './option/option.component';
import { ShPercentComponent } from './percent/percent.component';
import { ErrorMessagePipe, WarningMessagePipe } from './pipes/error-message.pipe';
import { ShProgressBarComponent } from './progress-bar/progress-bar.component';
import { ShRadioComponent } from './radio/radio.component';
import { ShRowComponent } from './row/row.component';
import { ShSectionComponent } from './section/section.component';
import { ShSelectComponent } from './select/select.component';
import { ShSidebarItemComponent } from './sidebar-item/sidebar-item.component';
import { ShSidebarSearchComponent } from './sidebar-search/sidebar-search.component';
import { ShSidebarComponent } from './sidebar/sidebar.component';
import { ShSliderComponent } from './slider/slider.component';
import { ShSpinnerComponent } from './spinner/spinner.component';
import { ShTabsComponent } from './tabs/tabs.component';
import { ShTemplateComponent } from './template/template.component';
import { ShTextComponent } from './text/text.component';
import { ShTextareaComponent } from './textarea/textarea.component';
import { ShTimeComponent } from './time/time.component';
import { ShTimerComponent } from './timer/timer.component';
import { ShToggleComponent } from './toggle/toggle.component';
import { ShToolbarComponent } from './toolbar/toolbar.component';
import { ShValidationMessageComponent } from './validation-message/validation-message.component';
import { CountdownComponent } from 'ngx-countdown';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { ShTranslateModule } from '../i18n/translate.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    A11yModule,
    PolicyEngineModule,
    ClickOutsideModule,
    ShServicesModule,
    I18nModule,
    ShTranslateModule,
    ContextMenuModule,
    AngularMyDatePickerModule,
    ShDirectivesModule,
    ShPipesModule,
    NgxMaskDirective,
    NgxMaskPipe,
    CountdownComponent
  ],
  exports: [
    PolicyEngineModule,
    // ClickOutsideModule,
    AngularMyDatePickerModule,
    ShServicesModule,
    ShPipesModule,
    ShTemplateComponent,
    ShFormControlComponent,
    ShLabelComponent,
    ShValidationMessageComponent,
    ErrorMessagePipe,
    WarningMessagePipe,
    ShButtonComponent,
    ShBreadcrumbComponent,
    ShDateComponent,
    ShDateTimeComponent,
    ShTimeComponent,
    ShFormComponent,
    ShFormGroupComponent,
    ShFormArrayComponent,
    ShCheckboxComponent,
    ShCheckgroupComponent,
    ShOptionComponent,
    ShNumberComponent,
    ShPercentComponent,
    ShCurrencyComponent,
    ShSelectComponent,
    ShSliderComponent,
    ShComboComponent,
    ShContextMenuComponent,
    ShContextMenuItemComponent,
    ShRadioComponent,
    ShModalComponent,
    ShMultiSelectComponent,
    ShSpinnerComponent,
    ShTabsComponent,
    ShTextareaComponent,
    ShTextComponent,
    ShFlexibleContentComponent,
    ShColumnComponent,
    ShRowComponent,
    ShSidebarComponent,
    ShSidebarItemComponent,
    ShIconComponent,
    ShContainerComponent,
    ShSidebarSearchComponent,
    ShCaptionComponent,
    ShToggleComponent,
    ShToolbarComponent,
    ShHeaderComponent,
    ShCardComponent,
    ShSectionComponent,
    ShCommandsBarComponent,
    ShProgressBarComponent,
    ShMaskComponent,
    ShTimerComponent,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  declarations: [
    ShTemplateComponent,
    ShFormControlComponent,
    ShLabelComponent,
    ShValidationMessageComponent,
    ErrorMessagePipe,
    WarningMessagePipe,
    ShButtonComponent,
    ShBreadcrumbComponent,
    ShFormComponent,
    ShFormGroupComponent,
    ShFormArrayComponent,
    ShCheckboxComponent,
    ShCheckgroupComponent,
    ShDateComponent,
    ShDateTimeComponent,
    ShTimeComponent,
    ShModalComponent,
    ShNumberComponent,
    ShOptionComponent,
    ShPercentComponent,
    ShCurrencyComponent,
    ShSelectComponent,
    ShComboComponent,
    ShContextMenuComponent,
    ShContextMenuItemComponent,
    ShRadioComponent,
    ShSpinnerComponent,
    ShSliderComponent,
    ShMultiSelectComponent,
    ShTabsComponent,
    ShTextareaComponent,
    ShTextComponent,
    ShFlexibleContentComponent,
    ShColumnComponent,
    ShRowComponent,
    ShSidebarComponent,
    ShSidebarItemComponent,
    ShIconComponent,
    ShContainerComponent,
    ShSidebarSearchComponent,
    ShCaptionComponent,
    ShToggleComponent,
    ShToolbarComponent,
    ShHeaderComponent,
    ShCardComponent,
    ShSectionComponent,
    ShCommandsBarComponent,
    ShProgressBarComponent,
    ShProgressBarPercentPipe,
    ShMaskComponent,
    ShTimerComponent
  ],
  providers: [
    { provide: DEFAULT_NUMERAL, useValue: 0 },
    { provide: TemplateDictionary, useValue: ShTemplate },
    provideNgxMask({
      validation: true
    }),
  ]
})
export class ShComponentsModule { }
