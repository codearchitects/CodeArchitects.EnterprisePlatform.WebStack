import { List } from './list';

describe('List', () => {
  let list: List<number>;

  beforeEach(() => {
    list = new List<number>();
    list.add(2);
    list.add(1);
    list.add(3);
  });

  it('should provide an item corresponding to the required index', () => {
    let item = list.get(0);
    expect(item).toEqual(2);
  });

  it('should throw a range error if the required index to get is negative', () => {
    expect(() => list.get(-1)).toThrow();
  });

  it('should throw a range error if the required index to get is over the maximum index', () => {
    expect(() => list.get(list.count)).toThrow();
  });

  it('should set an item at the required index', () => {
    list.set(1, 4);
    expect(list.get(1)).toEqual(4);
  });

  it('should throw a range error if the required index to set is negative', () => {
    expect(() => list.set(4, -1)).toThrow();
  });

  it('should throw a range error if the required index to set is over the maximum index', () => {
    expect(() => list.set(4, list.count)).toThrow();
  });

  it('should provide the list length', () => {
    expect(list.count).toEqual(3);
  });

  it('should add an item', () => {
    list.add(4);
    expect(list.count).toEqual(4);
    expect(list.get(3)).toEqual(4);
  });

  it('should add a range of elements', () => {
    list.addRange([4, 5, 6]);
    expect(list.count).toEqual(6);
    expect(list.get(3)).toEqual(4);
    expect(list.get(4)).toEqual(5);
    expect(list.get(5)).toEqual(6);
  });

  it('should throw an error if adding a null range of elements', () => {
    expect(() => list.addRange(null as any)).toThrow();
  });

  it('should clear itself', () => {
    list.clear();
    expect(list.count).toEqual(0);
  });

  it('should check if the list contains an item', () => {
    expect(list.contains(3)).toEqual(true);
  });

  it('should check if the list does not contain an item', () => {
    expect(list.contains(4)).toEqual(false);
  });

  it('should iterate across all the items', () => {
    let targets = [1, 2, 3];
    list.forEach(item => {
      targets = targets.filter(target => item !== target);
    });
    expect(targets.length).toEqual(0);
  });

  it('should throw an error if sending a null action to forEach', () => {
    expect(() => list.forEach(null as any)).toThrow();
  });

  it('should provide the first index of an item', () => {
    list.add(2);
    expect(list.indexOf(2)).toEqual(0);
  });

  it('should provide the first index of an item in a range from a specific index to the last index', () => {
    list.add(2);
    expect(list.indexOf(2, 2)).toEqual(3);
  });

  it('should throw a range error if the index from which the search begins is out of range', () => {
    expect(() => list.indexOf(2, -1)).toThrow();
  });

  it('should insert an item at a specific index', () => {
    list.insert(1, 4);
    expect(list.count).toEqual(4);
    expect(list.get(0)).toEqual(2);
    expect(list.get(1)).toEqual(4);
    expect(list.get(2)).toEqual(1);
    expect(list.get(3)).toEqual(3);
  });

  it('should throw an error if the required index to insert an item is out of range', () => {
    expect(() => list.insert(-1, 4)).toThrow();
  });

  it('should insert a range of elements at a specific index', () => {
    list.insertRange(1, [4, 5]);
    expect(list.count).toEqual(5);
    expect(list.get(0)).toEqual(2);
    expect(list.get(1)).toEqual(4);
    expect(list.get(2)).toEqual(5);
    expect(list.get(3)).toEqual(1);
    expect(list.get(4)).toEqual(3);
  });

  it('should throw an error if inserting a null range of elements', () => {
    expect(() => list.insertRange(1, null as any)).toThrow();
  });

  it('should throw a range error if the required index to insert a range of elements is out of range', () => {
    expect(() => list.insertRange(-1, [4, 5])).toThrow();
  });

  it('should provide the last index of an item', () => {
    list.add(2);
    expect(list.lastIndexOf(2)).toEqual(3);
  });

  it('should provide the last index of an item in a range from 0 to a specific index', () => {
    list.add(2);
    expect(list.lastIndexOf(2, 2)).toEqual(0);
  });

  it('should throw a range error if the index from which the backward search begins is out of range', () => {
    expect(() => list.lastIndexOf(2, -1)).toThrow();
  });

  it('should try to remove an item and check if it is deleted', () => {
    var check = list.remove(2);
    expect(check).toEqual(true);
    expect(list.count).toEqual(2);
    expect(list.get(0)).toEqual(1);
    expect(list.get(1)).toEqual(3);
  });

  it('should try to remove an item and check if it is not deleted', () => {
    var check = list.remove(4);
    expect(check).toEqual(false);
    expect(list.count).toEqual(3);
  });

  it('should remove an item at a specific index', () => {
    list.removeAt(1);
    expect(list.count).toEqual(2);
    expect(list.get(0)).toEqual(2);
    expect(list.get(1)).toEqual(3);
  });

  it('should throw a range error if the required index to remove is out of range', () => {
    expect(() => list.removeAt(list.count)).toThrow();
  });

  it('should remove a range of elements', () => {
    list.removeRange(1, 2);
    expect(list.count).toEqual(1);
    expect(list.get(0)).toEqual(2);
  });

  it('should throw a range error if the required index range to remove is out of range', () => {
    expect(() => list.removeRange(1, 4)).toThrow();
  });

  it('should throw a range error if the number of elements to remove is negative', () => {
    expect(() => list.removeRange(2, -1)).toThrow();
  });

  it('should reverse itself', () => {
    list.reverse();
    expect(list.get(0)).toEqual(3);
    expect(list.get(1)).toEqual(1);
    expect(list.get(2)).toEqual(2);
  });

  it('should reverse a range of elements', () => {
    list.reverse(1, 2);
    expect(list.get(0)).toEqual(2);
    expect(list.get(1)).toEqual(3);
    expect(list.get(2)).toEqual(1);
  });

  it('should throw a range error if the required index range to reverse is out of range', () => {
    expect(() => list.reverse(1, 4)).toThrow();
  });

  it('should throw a range error if the number of elements to reverse is negative', () => {
    expect(() => list.reverse(2, -1)).toThrow();
  });

  it('should sort itself', () => {
    list.sort();
    expect(list.get(0)).toEqual(1);
    expect(list.get(1)).toEqual(2);
    expect(list.get(2)).toEqual(3);
  });

  it('should sort a range of elements', () => {
    list.sort(0, 2);
    expect(list.get(0)).toEqual(1);
    expect(list.get(1)).toEqual(2);
    expect(list.get(2)).toEqual(3);
  });

  it('should throw a range error if the required index range to sort is out of range', () => {
    expect(() => list.sort(1, 4)).toThrow();
  });

  it('should throw a range error if the number of elements to sort is negative', () => {
    expect(() => list.sort(2, -1)).toThrow();
  });

  it('should provide an array with all items', () => {
    expect(list.toArray()).toEqual([2, 1, 3]);
  });
});
