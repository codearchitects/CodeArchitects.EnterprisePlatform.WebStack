import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CaepPipesModule } from '../pipes';
import { CaepServicesModule } from '../services';
import { CaepFormControlComponent } from './form-control/form-control.component';
import { CaepOptionComponent } from './option/option.component';
import { CaepTemplateComponent } from './template/template.component';
import { CaepAppHeaderComponent, CaepAppHeaderService } from './app-header';
import { CaepAppSidebarComponent } from './app-sidebar/app-sidebar.component';
import { CaepFloatingCommandsComponent } from './floating-commands/floating-commands.component';
import { MockMultiSelectComponent } from './mock-multiselect/mock-multiselect.component';
import { MockTextComponent } from './mock-text/mock-text.component';
import { CaepErrorMessagePipe } from './pipes';
import { CaepSidePanelComponent } from './side-panel/side-panel.component';
import { CaepTextComponent } from './text/text.component';

@NgModule({
  declarations: [
    CaepAppHeaderComponent,
    CaepAppSidebarComponent,
    CaepFloatingCommandsComponent,
    CaepSidePanelComponent,
    CaepOptionComponent,
    CaepFormControlComponent,
    CaepTemplateComponent,
    CaepErrorMessagePipe,
    MockMultiSelectComponent,
    MockTextComponent,
    CaepTextComponent
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CaepPipesModule, CaepServicesModule],
  exports: [
    CaepAppHeaderComponent,
    CaepAppSidebarComponent,
    CaepFloatingCommandsComponent,
    CaepSidePanelComponent,
    CaepPipesModule,
    CaepServicesModule,
    CaepOptionComponent,
    CaepFormControlComponent,
    CaepTemplateComponent,
    CaepErrorMessagePipe,
    MockMultiSelectComponent,
    MockTextComponent,
    CaepTextComponent
  ],
  providers: [CaepAppHeaderService]
})
export class CaepComponentsModule {}
