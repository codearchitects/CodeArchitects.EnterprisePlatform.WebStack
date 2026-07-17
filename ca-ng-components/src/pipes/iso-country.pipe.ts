import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'isoCountry'
})
export class ISOCountryPipe implements PipeTransform {
    transform(value: string) {
        return value === 'en' ? 'gb' : value;
    }
}
