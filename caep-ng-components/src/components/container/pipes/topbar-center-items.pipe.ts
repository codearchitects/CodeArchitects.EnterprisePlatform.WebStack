import { Pipe, PipeTransform } from '@angular/core';
import { CaepTopbarItemPosition, ICaepTopbarItem } from '../models';

@Pipe({
    name: 'topbarCenterItems',
    standalone: false
})
export class CaepTopbarCenterItemsPipe implements PipeTransform {
  transform(items?: ICaepTopbarItem[]): any {
    if (!items?.length) return null;
    const centerItems = items.filter(itm => itm.position === CaepTopbarItemPosition.Center);
    if (!centerItems.length) return null;
    // LTR ascending order.
    return centerItems.sort((left, right) => {
      if (left.order == null) return 1;
      if (right.order == null) return -1;
      return left.order - right.order;
    });
  }
}
