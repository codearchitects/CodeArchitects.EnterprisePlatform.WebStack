import {List} from './list';
import {expect} from 'chai';

describe('List', () => {
  // Arrange
  let list: List<number>;

  beforeEach(() => {
    list = new List<number>();
    list.add(2);
    list.add(1);
    list.add(3);
  });

  it('should provide an item corrisponding the required index', () => {
    // Act
    let item = list.get(0);

    // Assert
    expect(item).to.equal(2);
  });

  it('should throw a range error if required index to get is negative', () => {
    // Assert
    expect(() => list.get(-1))
      .to.throw();
  });

  it('should throw a range error if required index to get is over the maximum index', () => {
    // Assert
    expect(() => list.get(list.count))
      .to.throw();
  });

  it('should set an item at the required index', () => {
    // Act
    list.set(1, 4);

    // Assert
    expect(list.get(1)).to.equal(4);
  });

  it('should throw a range error if required index to set is negative', () => {
    // Assert
    expect(() => list.set(4, -1))
      .to.throw();
  });

  it('should throw a range error if required index to set is over the maximum index', () => {
    // Assert
    expect(() => list.set(4, list.count))
      .to.throw();
  });

  it('should provide the list length', () => {
    // Assert
    expect(list.count).to.equal(3);
  });

  it('should add an item', () => {
    // Act
    list.add(4);

    // Assert
    expect(list.count).to.equal(4);
    expect(list.get(3)).to.equal(4);
  });

  it('should add a range of elements', () => {
    // Act
    list.addRange([4, 5, 6]);

    // Assert
    expect(list.count).to.equal(6);
    expect(list.get(3)).to.equal(4);
    expect(list.get(4)).to.equal(5);
    expect(list.get(5)).to.equal(6);
  });

  it('should throw an error if add a null range of elements', () => {
    // Assert
    expect(() => list.addRange(null))
      .to.throw();
  });

  it('should clear itself', () => {
    // Act
    list.clear();

    // Assert
    expect(list.count).to.equal(0);
  });

  it('should check if list contains an item', () => {
    // Assert
    expect(list.contains(3)).to.equal(true);
  });

  it('should check if list does not contains an item', () => {
    // Assert
    expect(list.contains(4)).to.equal(false);
  });

  it('should iterate across all the items', () => {
    // Arrange
    let targets = [1, 2, 3];

    // Act
    list.forEach(item => targets = targets.filter(target => item !== target));

    // Assert
    expect(targets.length).to.equal(0);
  });

  it('should throw an error if send null action to forEach', () => {
    // Assert
    expect(() => list.forEach(null))
      .to.throw();
  });

  it('should provide the first index of an item', () => {
    // Act
    list.add(2);

    // Assert
    expect(list.indexOf(2)).to.equal(0);
  });

  it('should provide the first index of an item in a range from a specific index to last index', () => {
    // Act
    list.add(2);

    // Assert
    expect(list.indexOf(2, 2)).to.equal(3);
  });

  it('should throw a range error if index from which the search begin is out of range', () => {
    // Assert
    expect(() => list.indexOf(2, -1))
      .to.throw();
  });

  it('should insert an item at a specific index', () => {
    // Act
    list.insert(1, 4);

    // Assert
    expect(list.count).to.equal(4);
    expect(list.get(0)).to.equal(2);
    expect(list.get(1)).to.equal(4);
    expect(list.get(2)).to.equal(1);
    expect(list.get(3)).to.equal(3);
  });

  it('should throw an error if required index to insert item is out of range', () => {
    // Assert
    expect(() => list.insert(-1, 4))
      .to.throw();
  });

  it('should insert a range of elements at a specific index', () => {
    // Act
    list.insertRange(1, [4, 5]);

    // Assert
    expect(list.count).to.equal(5);
    expect(list.get(0)).to.equal(2);
    expect(list.get(1)).to.equal(4);
    expect(list.get(2)).to.equal(5);
    expect(list.get(3)).to.equal(1);
    expect(list.get(4)).to.equal(3);
  });

  it('should throw an error if insert a null range of elements', () => {
    // Assert
    expect(() => list.insertRange(1, null))
      .to.throw();
  });

  it('should throw a range error if required index to insert range of elements is out of range', () => {
    // Assert
    expect(() => list.insertRange(-1, [4, 5]))
      .to.throw();
  });

  it('should provide the last index of an item', () => {
    // Act
    list.add(2);

    // Assert
    expect(list.lastIndexOf(2)).to.equal(3);
  });

  it('should provide the last index of an item in a range from 0 to a specific index', () => {
    // Act
    list.add(2);

    // Assert
    expect(list.lastIndexOf(2, 2)).to.equal(0);
  });

  it('should throw a range error if index from which the backward search begin is out of range', () => {
    // Assert
    expect(() => list.lastIndexOf(2, -1))
      .to.throw();
  });

  it('should try to remove an item and check if is deleted', () => {
    // Act
    var check = list.remove(2);

    // Assert
    expect(check).to.equal(true);
    expect(list.count).to.equal(2);
    expect(list.get(0)).to.equal(1);
    expect(list.get(1)).to.equal(3);
  });

  it('should try to remove an item and check if is not deleted', () => {
    // Act
    var check = list.remove(4);

    // Assert
    expect(check).to.equal(false);
    expect(list.count).to.equal(3);
  });

  it('should remove an item at a specific index', () => {
    // Act
    list.removeAt(1);

    // Assert
    expect(list.count).to.equal(2);
    expect(list.get(0)).to.equal(2);
    expect(list.get(1)).to.equal(3);
  });

  it('should throw a range error if required index to remove is out of range', () => {
    // Assert
    expect(() => list.removeAt(list.count))
      .to.throw();
  });

  it('should remove a range of elements', () => {
    // Act
    list.removeRange(1, 2);

    // Assert
    expect(list.count).to.equal(1);
    expect(list.get(0)).to.equal(2);
  });

  it('should throw a range error if required index range to remove is out of range', () => {
    // Assert
    expect(() => list.removeRange(1, 4))
      .to.throw();
  });

  it('should throw a range error if the number of elements to remove is negative', () => {
    // Assert
    expect(() => list.removeRange(2, -1))
      .to.throw();
  });

  it('should reverse itself', () => {
    // Act
    list.reverse();

    // Assert
    expect(list.get(0)).to.equal(3);
    expect(list.get(1)).to.equal(1);
    expect(list.get(2)).to.equal(2);
  });

  it('should reverse a range of elements', () => {
    // Act
    list.reverse(1, 2);

    // Assert
    expect(list.get(0)).to.equal(2);
    expect(list.get(1)).to.equal(3);
    expect(list.get(2)).to.equal(1);
  });

  it('should throw a range error if required index range to reverse is out of range', () => {
    // Assert
    expect(() => list.reverse(1, 4))
      .to.throw();
  });

  it('should throw a range error if the number of elements to reverse is negative', () => {
    // Assert
    expect(() => list.reverse(2, -1))
      .to.throw();
  });

  it('should sort itself', () => {
    // Act
    list.sort();

    // Assert
    expect(list.get(0)).to.equal(1);
    expect(list.get(1)).to.equal(2);
    expect(list.get(2)).to.equal(3);
  });

  it('should sort a range of elements', () => {
    // Act
    list.sort(0, 2);

    // Assert
    expect(list.get(0)).to.equal(1);
    expect(list.get(1)).to.equal(2);
    expect(list.get(2)).to.equal(3);
  });

  it('should throw a range error if required index range to reverse is out of range', () => {
    // Assert
    expect(() => list.sort(1, 4))
      .to.throw();
  });

  it('should throw a range error if the number of elements to sort is negative', () => {
    // Assert
    expect(() => list.sort(2, -1))
      .to.throw();
  });

  it('should provide an array with all items', () => {
    // Assert
    expect(list.toArray()).to.deep.equal([2, 1, 3]);
  });
});
