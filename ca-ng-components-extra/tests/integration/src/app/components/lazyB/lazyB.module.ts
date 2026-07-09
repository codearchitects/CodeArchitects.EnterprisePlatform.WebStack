import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CaepComponentsModule } from '@ca-webstack/ng-components-extra';
import { ComponentBComponent } from './componentB.component';
import { PipeBPipe } from './pipeB.pipe';
import { RouterModule, Routes } from '@angular/router';


@NgModule({
    declarations: [ ComponentBComponent, PipeBPipe ],
    imports: [CommonModule, CaepComponentsModule, RouterModule.forChild([ { path: "", component: ComponentBComponent } ] as Routes) ],
    providers: [ ],
})
export class LazyBModule {}