import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'progressBarPercent'
})
export class ShProgressBarPercentPipe implements PipeTransform {

  transform(value: number, min: number, max: number): number {
    return  ((value < min ? min : value) / max ) || 0;
  }

}
