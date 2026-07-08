import { Injectable, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import numeral from 'numeral';
@Injectable()
export class NumberParserService implements OnDestroy {
  /**
   * Subject which notifies subscribers when service destroy itself
   */
  /*protected*/ public destroy$ = new Subject<void>();

  /*protected*/ public decimalSeparator = '.'; // (1.1).toLocaleString().replace(/\d/g, '');
  /*protected*/ public groupSeparator = ','; // (1000).toLocaleString().replace(/\d/g, '');

  constructor(private translate: TranslateService) {
    this.setupSeparators(this.translate.currentLang);
    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((r) => {
        this.setupSeparators(r.lang);
      });
  }


  private setupSeparators(lang: string) {
    const isEn = lang.includes('en');
    this.decimalSeparator = isEn ? '.' : ',';
    this.groupSeparator = isEn ? ',' : '.';
    if (numeral.locale() !== lang) {
      numeral.locale(lang);
    }
  }

  public ngOnDestroy() {
    this.destroy$.next();
  }

  tolerantCheck(value: string, allowNegative: boolean, decimalPlaces: number) {
    return this.tolerantRegex(allowNegative, decimalPlaces).test(value);
  }

  strictCheck(value: string, allowNegative: boolean, decimalPlaces: number) {
    return this.strictRegex(allowNegative, decimalPlaces).test(value);
  }

  strictParse(value: string, allowNegative: boolean, decimalPlaces: number) {
    const parts = this.strictRegex(allowNegative, decimalPlaces).exec(value);

    const integerPart = parts[1];
    const decimalPart = parts[parts.length - 1];
    return parseFloat(`${integerPart}.${decimalPart}`);
  }

  /*protected*/ public tolerantRegex(allowNegative: boolean, decimalPlaces: number) {
    const regexBuilder = '^'
      + '(' + this.negativeNumberRegex(allowNegative) + '\\d*)'
      + this.decimalSeparatorRegex(decimalPlaces, true)
      + '(' + this.decimalPlacesRegex(decimalPlaces, true) + ')'
      + '$';

    return new RegExp(regexBuilder);
  }

  /*protected*/ public strictRegex(allowNegative: boolean, decimalPlaces: number) {
    const regexBuilder = '^'
      + '(' + this.negativeNumberRegex(allowNegative) + '\\d+)'
      + '('
      + this.decimalSeparatorRegex(decimalPlaces)
      + '(' + this.decimalPlacesRegex(decimalPlaces) + ')'
      + ')?'
      + '$';

    return new RegExp(regexBuilder);
  }

  /*protected*/ public negativeNumberRegex(allowNegative: boolean) {
    return allowNegative ? '\\-?' : '';
  }

  /*protected*/ public decimalSeparatorRegex(decimalPlaces: number, tolerant = false) {
    let result = '';
    if (decimalPlaces > 0) {
      result += `\\${this.decimalSeparator}`;
      if (tolerant) {
        result += '?';
      }
    }
    return result;
  }

  /*protected*/ public groupSeparatorRegex() {
    return `\\${this.groupSeparator}`;
  }

  /*protected*/ public decimalPlacesRegex(decimalPlaces: number, tolerant = false) {
    let result = '';
    if (decimalPlaces > 0) {
      result += tolerant ? '\\d{0' : '\\d{1';
      if (decimalPlaces !== undefined) {
        result += `,${decimalPlaces}`;
      }
      result += '}';
    }
    return result;
  }

}
