import {Dictionary} from './dictionary';
import {expect} from 'chai';

describe('Dictionary', () => {

  describe('with string key', () => {

    // Arrange
    let dictionary: Dictionary<string, number>;

    beforeEach(() => {
      dictionary = new Dictionary<string, number>();
      dictionary.add('a', 2);
      dictionary.add('b', 1);
      dictionary.add('c', 3);
    });

    it('should provide an item corrisponding the required key', () => {
      // Act
      var item = dictionary.get('b');

      // Assert
      expect(item).to.equal(1);
    });

    it('should throw an error if the key to get is null', () => {
      // Assert
      expect(() => dictionary.get(null))
        .to.throw();
    });

    it('should throw an error if the key to get does not exist in the collection', () => {
      // Assert
      expect(() => dictionary.get('d'))
        .to.throw();
    });

    it('should set an item at the required key', () => {
      //Act
      dictionary.set('b', 4);

      // Assert
      expect(dictionary.get('b')).to.equal(4);
    });

    it('should add an item if the key to set does not exist in the collection', () => {
      //Act
      dictionary.set('d', 4);

      // Assert
      expect(dictionary.get('d')).to.equal(4);
    });

    it('should throw an error if the key to set is null', () => {
      // Assert
      expect(() => dictionary.set(null, 4))
        .to.throw();
    });

    it('should provide the dictionary length', () => {
      // Assert
      expect(dictionary.count).to.equal(3);
    });

    it('should provide keys collection', () => {
      // Assert
      expect(dictionary.keys).to.be.deep.equal(['a', 'b', 'c']);
    });

    it('should provide items collection', () => {
      // Assert
      expect(dictionary.values).to.be.deep.equal([2, 1, 3]);
    });

    it('should add an item', () => {
      //Act
      dictionary.add('d', 4);

      // Assert
      expect(dictionary.count).to.equal(4);
      expect(dictionary.get('d')).to.equal(4);
    });

    it('should throw an error if the key to add already exist in the collection', () => {
      // Assert
      expect(() => dictionary.add('b', 4))
        .to.throw();
    });

    it('should clear itself', () => {
      //Act
      dictionary.clear();

      // Assert
      expect(dictionary.count).to.equal(0);
    });

    it('should check if dictionary contains a key', () => {
      // Assert
      expect(dictionary.containsKey('b')).to.equal(true);
    });

    it('should check if dictionary does not contain a key', () => {
      // Assert
      expect(dictionary.containsKey('d')).to.equal(false);
    });

    it('should throw en error if searched key is null', () => {
      // Assert
      expect(() => dictionary.containsKey(null))
        .to.throw();
    });

    it('should check if dictionary contains a value', () => {
      // Assert
      expect(dictionary.containsValue(2)).to.equal(true);
    });

    it('should check if dictionary does not contain a value', () => {
      // Assert
      expect(dictionary.containsValue(2)).to.equal(true);
    });

    it('should try to remove an item at a specific key and check if is deleted', () => {
      //Act
      var check = dictionary.remove('b');

      // Assert
      expect(check).to.equal(true);
      expect(dictionary.count).to.equal(2);
      expect(dictionary.containsKey('b')).to.equal(false);
    });

    it('should try to remove an item at a specific key and check if is not deleted', () => {
      //Act
      var check = dictionary.remove('d');

      // Assert
      expect(check).to.equal(false);
      expect(dictionary.count).to.equal(3);
    });

    it('should throw an error if the key to remove is null', () => {
      // Assert
      expect(() => dictionary.remove(null))
        .to.throw();
    });
  });

  describe('with object key', () => {
    interface IFakeObject {
      text: string;
    }

    // Arrange
    let dictionary: Dictionary<IFakeObject, number>;
    let firstObj: IFakeObject = { text: 'first' };
    let secondObj: IFakeObject = { text: 'second' };

    beforeEach(() => {
      dictionary = new Dictionary<IFakeObject, number>();
      dictionary.add(firstObj, 2);
      dictionary.add(secondObj, 1);
    });

    it('should provide an item corrisponding the required key', () => {
      //Act
      var item = dictionary.get(secondObj);

      // Assert
      expect(item).to.equal(1);
    });
  });
});
