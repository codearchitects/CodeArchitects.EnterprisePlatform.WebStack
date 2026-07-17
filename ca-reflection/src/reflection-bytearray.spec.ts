import 'core-js';
import { Serializer } from './reflection';
import { expect } from 'chai';

describe('reflection.ts byte arraytests', () => {
  context('serialization', () => {
    let arrayData = `{
  "blob": {
    "$type": "System.Byte[], mscorlib",
    "$value": "AQIDBAUGBwgJCg=="
  }
}`;
    it('deserialization is OK', () => {
      let deserializedArrayData = new Serializer().deserialize(arrayData);
      expect(deserializedArrayData);
      expect(deserializedArrayData.blob);
      for (let i = 0; i < 10; i++) {
        expect(deserializedArrayData.blob[i]).equal(i + 1, 'i = ' + i);
      }
    });
    it('serialization is OK', () => {
      let deserializedArrayData = new Serializer().deserialize(arrayData);
      let serializedData = new Serializer().serialize(deserializedArrayData);
      expect(serializedData);
      let actualObject = JSON.parse(serializedData.replace(/'/g, '"'));
      expect(actualObject.blob);
      expect(actualObject.blob.$type).equal('System.Byte[], mscorlib', 'type is System.Byte[], mscorlib');
      expect(actualObject.blob.$value).equal('AQIDBAUGBwgJCg==', 'value is AQIDBAUGBwgJCg==');
    });
  });
});
