import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CaepComponentsModule } from '@ca-webstack/ng-components-extra';
import { ComponentAComponent } from './componentA.component';
import { PipeAPipe } from './pipeA.pipe';
import { RouterModule, Routes } from '@angular/router';


@NgModule({
    declarations: [ ComponentAComponent, PipeAPipe ],
    imports: [CommonModule, CaepComponentsModule, RouterModule.forChild([ { path: "", component: ComponentAComponent } ] as Routes) ],
    providers: [ ],
})
export class LazyAModule {}