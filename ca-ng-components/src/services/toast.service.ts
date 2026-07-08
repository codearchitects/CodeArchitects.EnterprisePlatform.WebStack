import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IShToastOptions, ShToast } from '../models/toast';
import { DomSanitizer } from '@angular/platform-browser';
import { isNoU } from '../utilities/common.utility';
import { lastValueFrom } from 'rxjs';

const shToastTypeMappings = {
  'default': 'toast-default',
  'error': 'toast-error',
  'info': 'toast-info',
  'success': 'toast-success',
  'warning': 'toast-warning'
}

@Injectable({
  providedIn: 'root'
})
export class ShToastService {

  constructor(
    private _toasterService: ToastrService,
    private _translateService: TranslateService,
    private _sanitizer: DomSanitizer
  ) { }

  public async pop(options: IShToastOptions) {
    //options.id = options.id || `${this._id++}`;
    options.attribution = options.attribution || new Date().toLocaleString();
    const translatedTitle = await lastValueFrom(this._translateService.get(options.title));
    const translatedBody = options.body ? await lastValueFrom(this._translateService.get(options.body)) : '';
    let htmlBodyMessage = `
    <div class="toast-body-message">${translatedBody}</div>
    <div class="toast-attribution">${options.attribution}</div>
    `;
    let type: string;
    if (options.avatar) {
      htmlBodyMessage = this._sanitizer.bypassSecurityTrustHtml(`${htmlBodyMessage}
      <div class="toast-avatar" style="background:${options.avatar.color};">
          <i class="icon icon-${options.avatar.icon}" style="color:${options.avatar.iconColor}"></i>
      </div>`) as any;
      type = 'warning';
    } else {
      htmlBodyMessage = this._sanitizer.bypassSecurityTrustHtml(htmlBodyMessage) as any;
      type = options.type || 'default';
    }
    const individualConfig = this.getIndividualConfig(options);
    const toastDescriptor = this._toasterService.show(htmlBodyMessage, translatedTitle, individualConfig, shToastTypeMappings[type]);
    const toast = new ShToast(options, toastDescriptor);
    if(toast.onClickCallback)
      toastDescriptor.onTap.subscribe(() => toast.onClickCallback(toast)); //take until pattern not necessary
    if(toast.onShowCallback)
      toastDescriptor.onShown.subscribe(() => toast.onShowCallback(toast));
    if(toast.onHideCallback) {
      toastDescriptor.onHidden.subscribe(() => toast.onHideCallback(toast));
    }
    return toast;
  }

  public clear(toastId: number) {
    this._toasterService.clear(toastId);
  }

  private getIndividualConfig(options: IShToastOptions) {
    const config: Partial<IndividualConfig> = {};
    if(!isNoU(options.timeout)) 
      config.timeOut = options.timeout;
    return config;
  }

}
