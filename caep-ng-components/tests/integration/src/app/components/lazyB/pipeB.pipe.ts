import { Pipe, PipeTransform } from '@angular/core';
import { CaepPipe } from '@caep/ng-components';

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