import { ToasterService } from 'angular2-toaster';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IShToastOptions, ShToast } from '../models/toast';

@Injectable({
  providedIn: 'root'
})
export class ShToastService {

  private _id = 0;

  constructor(
    private _toasterService: ToasterService,
    private _translateService: TranslateService
  ) { }

  public async pop(options: IShToastOptions) {
    options.id = options.id || `${this._id++}`;
    options.attribution = options.attribution || new Date().toLocaleString();
    options.title = await this._translateService.get(options.title).toPromise();
    options.body = options.body ? await this._translateService.get(options.body).toPromise() : '';
    const toast = new ShToast(options);
    this._toasterService.pop(toast);
    return toast;
  }

  public clear(toastId: string) {
    this._toasterService.clear(toastId);
  }
}
