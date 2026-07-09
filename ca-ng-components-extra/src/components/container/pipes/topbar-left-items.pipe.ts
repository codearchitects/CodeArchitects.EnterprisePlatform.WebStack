import { Pipe, PipeTransform } from '@angular/core';
import { CaepTopbarItemPosition, ICaepTopbarItem } from '../models';

@Pipe({
    name: 'topbarLeftItems',
    standalone: false
})
export class CaepTopbarLeftItemsPipe implements PipeTransform {
  transform(items?: ICaepTopbarItem[]): any {
    if (!items?.length) return null;
    const leftItems = items.filter(itm => itm.position === CaepTopbarItemPosition.Left);
    if (!leftItems.length) return null;
    // LTR ascending order.
    return leftItems.sort((left, right) => {
      if (left.order == null) return 1;
      if (right.order == null) return -1;
      return left.order - right.order;
    });
  }
}
