import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { IStackFrame, ITaskSlot } from '@ca-webstack/ng-shell';
import { TranslateModule } from '@ngx-translate/core';
import {
  CaepContainerComponent,
  CaepSideMenuComponent,
  CaepSideMenuEntryComponent,
  CaepTopbarButtonComponent,
  CaepTopbarComponent,
  CaepTopbarItemComponent
} from './components';
import { CaepRouterLinkActiveDirective, CaepRouterLinkDirective, CaepTopbarItemTemplateDirective } from './directives';
import { CaepSideMenuPreserveNavigationFlowCallback } from './models';
import { CaepTopbarCenterItemsPipe } from './pipes/topbar-center-items.pipe';
import { CaepTopbarItemTemplateContextPipe } from './pipes/topbar-item-template-context.pipe';
import { CaepTopbarLeftItemsPipe } from './pipes/topbar-left-items.pipe';
import { CaepTopbarRightItemsPipe } from './pipes/topbar-right-items.pipe';
import { CaepSideMenuService, CaepTopbarService } from './services';
import {
  CAEP_SIDE_MENU_STACK_FRAME_FACTORY,
  CAEP_SIDE_MENU_TASK_ID_INDEX,
  CAEP_SIDE_MENU_TASK_SLOT_FACTORY
} from './tokens';
import {
  CAEP_SIDE_MENU_PRESERVE_NAVIGATION_FLOW,
  CAEP_SIDE_MENU_PRESERVE_NAVIGATION_FLOW_OVERRIDE
} from './tokens/preserve-navigation-flow.token';

export interface CaepSideMenuServiceConfig {
  /**
   * Task identifier index within url.
   * Be careful. Location starts with `/`, which is considered as an empty segment.
   * e.g.:
   *
   *  - `/application/domain/scenario/taskId/state`: `taskId` is at index `4`
   *  - `application/domain/scenario/taskId/state`: `taskId` is at index `3`
   *
   * So you should always consider the first empty segment when changing this property.
   * @default 4
   */
  taskIdIndex?: number;
  /**
   * Preserve navigation flow callback implementation. This is called after base preserve navigation check success, unless override mode is set to true.
   */
  preserveNavigationFlow?: CaepSideMenuPreserveNavigationFlowCallback;
  /**
   * Whether preserve navigation flow is an override of base preserve navigation implementation.
   */
  preserveNavigationFlowOverride?: boolean;
  /**
   * Task slot factory used to create a new task slot when needed while navigating.
   */
  taskSlotFactory: () => ITaskSlot;
  /**
   * Stack frame factory used to create a new stack frame when needed while navigating.
   */
  stackFrameFactory: () => IStackFrame;
}

@NgModule({
  imports: [CommonModule, TranslateModule],
  declarations: [
    CaepSideMenuComponent,
    CaepContainerComponent,
    CaepSideMenuEntryComponent,
    CaepRouterLinkDirective,
    CaepRouterLinkActiveDirective,
    CaepTopbarComponent,
    CaepTopbarItemComponent,
    CaepTopbarItemTemplateDirective,
    CaepTopbarButtonComponent,
    CaepTopbarItemTemplateContextPipe,
    CaepTopbarLeftItemsPipe,
    CaepTopbarCenterItemsPipe,
    CaepTopbarRightItemsPipe
  ],
  exports: [
    CaepSideMenuComponent,
    CaepContainerComponent,
    CaepSideMenuEntryComponent,
    CaepRouterLinkDirective,
    CaepRouterLinkActiveDirective,
    CaepTopbarComponent,
    CaepTopbarItemComponent,
    CaepTopbarItemTemplateDirective,
    CaepTopbarButtonComponent
  ]
})
export class CaepContainerModule {
  public static forRoot(config: CaepSideMenuServiceConfig): ModuleWithProviders<CaepContainerModule> {
    const providers: Provider[] = [
      CaepSideMenuService,
      CaepTopbarService,
      {
        provide: CAEP_SIDE_MENU_STACK_FRAME_FACTORY,
        useValue: config.stackFrameFactory
      },
      {
        provide: CAEP_SIDE_MENU_TASK_SLOT_FACTORY,
        useValue: config.taskSlotFactory
      },
      {
        provide: CAEP_SIDE_MENU_TASK_ID_INDEX,
        useValue: config.taskIdIndex ?? 4
      },
      ...(config.preserveNavigationFlow
        ? [{ provide: CAEP_SIDE_MENU_PRESERVE_NAVIGATION_FLOW, useValue: config.preserveNavigationFlow }]
        : []),
      ...(config.preserveNavigationFlowOverride
        ? [{ provide: CAEP_SIDE_MENU_PRESERVE_NAVIGATION_FLOW_OVERRIDE, useValue: true }]
        : [])
    ];
    return {
      ngModule: CaepContainerModule,
      providers
    };
  }
}
