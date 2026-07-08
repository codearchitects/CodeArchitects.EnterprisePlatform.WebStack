import { Injectable, Sanitizer, SecurityContext, ɵBypassType, ɵallowSanitizationBypassAndThrow, ɵunwrapSafeValue } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import DOMPurify from 'dompurify';

//TEMPORARY SOLUTION: "ɵallowSanitizationBypassAndThrow" and "ɵunwrapSafeValue" are not part of Angular's public API but they are necessary to guarantee expected sanitization when a SafeHtml object returned from bypassSecurityTrustHtml() is passed to this custom sanitizer.
//This sanitizer is necessary to solve Angular issue on sanitization of html strings containing inline styles (check this thread https://github.com/angular/angular/issues/45270).
//Ngx-toastr does not get around this issue (differently from the old angular2-toaster), so this sanitizer is also required for showing correctly toasts with avatar.
//Adopting a non-public api requires checking its possible changes in future major Angular versions. So check eventual changes on SafeHtmlImpl and the adopted internal utilities when Angular update is executed.

//forRoot() implementation on ShComponentsModule is an alternative for providing this service to the root injector
@Injectable()
export class ShDompurifySanitizer implements Sanitizer {

    constructor(private _ngDomSanitizer: DomSanitizer) { }

    sanitize(context: SecurityContext, value: string | {}): string {
        switch (context) {
            case SecurityContext.HTML:
                if (ɵallowSanitizationBypassAndThrow(value, ɵBypassType.Html)) {
                    return ɵunwrapSafeValue(value);
                }
                return DOMPurify.sanitize(String(value || ''));
            default:
                return this._ngDomSanitizer.sanitize(context, value);
        }
    }
    
}