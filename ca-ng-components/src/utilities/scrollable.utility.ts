import 'jquery';

/**
 * Moves focus to collection result indicated by index
 * @param container The collection JQElement container
 * @param collection The collection
 * @param index The index of result for which move focus
 * @param next Checks if movement is forward or backward
 */
export function scrollTo(container: any, collection: HTMLCollection, index: number, next: boolean) {
  try {
    if (collection) {
      const current = getElementByIndex(collection, index);
      if (canScroll(collection, current, index, next)) {
        const first = getElementByIndex(collection, 0);
        const position = current.position().top;
        const offset = first.position().top;
        $(container).scrollTop(position - offset);
      }
    }
  } catch (error) {
    console.log('Cannot use scrollTo function');
  }
}

/**
 * Retrieves the item of collection corresponding to index
 * @param index The index of the item to retrieve
 */
function getElementByIndex(collection: HTMLCollection, index: number) {
  return $(collection.item(index));
}

/**
 * Checks if the dropdown can scroll to show next item
 * @param collection The collection JQ Element
 * @param item The dropdown item JQ Element
 * @param index The index of the current item
 * @param next Checks if movement is forward or backward
 */
function canScroll(collection: any, item: any, index: number, next: boolean) {
  let retval = false;
  if (item && collection) {
    const itemHeight = item[0].offsetHeight;
    const dropdownHeight = collection[0].offsetHeight;
    const numberOfItems = dropdownHeight / itemHeight;
    const mustRepeat = index > numberOfItems;
    const isMultiple = !!(Math.round(numberOfItems) % index);
    const isFirstNextItem = index === 1 && next;
    retval = mustRepeat || !(isFirstNextItem || isMultiple);
  }
  return retval;
}
