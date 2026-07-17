import { IControlNode } from "./models";

/**
 * Checks if date is valid
 * @param date The date for which performs check
 */
export function isDateValid(date: Date) {
  let isValid = true;
  if (date && isNaN(date.valueOf())) {
    isValid = false;
  }
  return isValid;
}

/**
 * Converts nodes collection to controls array
 * @param nodes Nodes collection
 */
export function toControls<TControls = any>(nodes: IControlNode<TControls>[]) {
  const retval: TControls[] = [];
  nodes.forEach(node => {
    if (node.toArray) {
      retval.push(...node.toArray());
    } else if (node.instance) {
      retval.push(node.instance);
    } else if (node.componentView) {
      retval.push(node.componentView.component);
    }
  });
  return retval;
}

/**
 * Create n-multidimensional array
 * @param dimensions 
 */
export function createNDimArray(dimensions: any[]) {
  if (dimensions.length > 0) {
    var dim = dimensions[0];
    var rest = dimensions.slice(1);
    var newArray = new Array();
    for (var i = 0; i < dim; i++) {
      newArray[i] = createNDimArray(rest);
    }
    return newArray;
  } else {
    return undefined;
  }
}

/**
 * Resize last dimension for n-multidimensional array
 * @param dimensions 
 */
export function getUpdatedArray(arr: any[], dimension: number) {
  for (let index = 0; index < arr.length; index++) {
    if (Array.isArray(arr[index][0])) {
      getUpdatedArray(arr[index], dimension)
    } else if (Array.isArray(arr[index])) {
      arr[index].length = dimension;
    }
  }
  return arr;
}

/**
 * Retrieve rank of a multidimensional array
 * @param arr
 */
export function getArrayRank(arr: any[]) {
  let rank = 0;
  let temp = arr;
  for (; ;) {
    if (Array.isArray(temp)) {
      temp = temp[0];
      rank++;
    } else {
      break;
    }
  }
  return rank;
}