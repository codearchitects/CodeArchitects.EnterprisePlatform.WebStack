import { Pipe, PipeTransform } from '@angular/core';
import { CaepPipe } from '@ca-webstack/ng-components-extra';

@CaepPipe({
    name: 'myPipe'
})
@Pipe({
    name: 'myPipe',
    standalone: false
})
export class PipeBPipe implements PipeTransform {

    constructor() { }

    transform(value: string): string {
      return value.toLowerCase();
    }
    
}