import 'core-js';
import { Serializer } from './reflection';

describe('reflection.ts byte arraytests', () => {
  const arrayData = `{
  "blob": {
    "$type": "System.Byte[], mscorlib",
    "$value": "AQIDBAUGBwgJCg=="
  }
}`;
  it('deserialization is OK', () => {
    let deserializedArrayData = new Serializer().deserialize(arrayData);
    expect(deserializedArrayData).toBeDefined();
    expect(deserializedArrayData.blob).toBeDefined();
    for (let i = 0; i < 10; i++) {
      expect(deserializedArrayData.blob[i]).toBe(i + 1);
    }
  });
  it('serialization is OK', () => {
    let deserializedArrayData = new Serializer().deserialize(arrayData);
    let serializedData = new Serializer().serialize(deserializedArrayData);
    expect(serializedData).toBeDefined();
    let actualObject = JSON.parse(serializedData.replace(/'/g, '"'));
    expect(actualObject.blob).toBeDefined();
    expect(actualObject.blob.$type).toBe('System.Byte[], System.Private.CoreLib');
    expect(actualObject.blob.$value).toBe('AQIDBAUGBwgJCg==');
  });
});
