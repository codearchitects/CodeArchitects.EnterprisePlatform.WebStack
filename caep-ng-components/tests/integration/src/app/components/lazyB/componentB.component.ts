import { Component } from '@angular/core';
import { CaepPipeMapperService } from '@caep/ng-components';

@Component({
    template: '<h1>Component B</h1><button type="button" (click)="onClick()">Test Pipe</button>',
    standalone: false
})
export class ComponentBComponent {

    constructor(public pipeMapper: CaepPipeMapperService) {}

    onClick() {
        //let pipe = this.injector.get(this.pipeMapper.findPipeByName('myPipe'));
        let pipeToken = this.pipeMapper.findPipeByName('myPipe');
        let pipe = new pipeToken();
        console.log(pipe.transform('tESt---------------------------'));
    }
}