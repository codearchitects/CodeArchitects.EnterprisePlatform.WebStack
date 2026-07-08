import { Params } from '@angular/router';

export interface IShRoute {
  name: string;
  params: any;
  queryParams?: Params;
}
