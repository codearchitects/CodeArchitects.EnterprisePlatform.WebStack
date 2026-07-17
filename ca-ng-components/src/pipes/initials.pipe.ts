import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initials'
})
export class InitialsPipe implements PipeTransform {

  transform(name: string) {
    if (!name || name.length < 1) {
      return '';
    }
    let initials = '';
    const words = name.split(' ');
    for (let i = 0; i < words.length && i < 2; i++) {
      const word = words[i];
      initials += word[0].toUpperCase();
    }
    return initials;
  }

}
