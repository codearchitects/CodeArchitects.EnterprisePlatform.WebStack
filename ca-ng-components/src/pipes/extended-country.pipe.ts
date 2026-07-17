import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'extendedCountry'
})
export class ExtendedCountryPipe implements PipeTransform {
    transform(value: string) {
        switch (value) {
            case 'it':
                return 'Italiano';
            case 'en':
                return 'English';
            case 'de':
                return 'Deutsche';
            case 'es':
                return 'Español';
        }
    }
}
