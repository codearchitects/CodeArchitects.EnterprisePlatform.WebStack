import { Pipe, PipeTransform } from '@angular/core';
import { CaepTopbarItemPosition, ICaepTopbarItem } from '../models';

@Pipe({
    name: 'topbarRightItems',
    standalone: false
})
export class CaepTopbarRightItemsPipe implements PipeTransform {
  transform(items?: ICaepTopbarItem[]): any {
    if (!items?.length) return null;
    const rightItems = items.filter(itm => itm.position === CaepTopbarItemPosition.Right);
    if (!rightItems.length) return null;
    // LTR descending order.
    return rightItems.sort((left, right) => {
      if (left.order == null) return -1;
      if (right.order == null) return 1;
      return right.order - left.order;
    });
  }
}
