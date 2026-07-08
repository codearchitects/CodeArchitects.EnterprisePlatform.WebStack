import 'core-js';
import { DateTime } from '@ca-webstack/data-structures';
import { ObjectWithDateTime, ObjectWithDateTimeBis, ObjectWithDateTimeBis2 } from './fixtures/model';
import * as model from './fixtures/index';
import { Serializer, Type, ITransformation, ConvertTo, ConvertFrom } from './reflection';
import { getJsonObject } from './reflection-decorators';

Type.CacheTypes('model.', model);
describe('reflection.ts tests', () => {
  describe('serialization', () => {
    let person: model.Person;
    let customer: model.Customer;
    let serializedPersonString: string;
    let serializedCustomerString: string;

    beforeEach(() => {
      person = new model.Person('Giuseppe', 'Verdi');
      customer = new model.Customer('Mario', 'Rossi', 30, person);
      serializedPersonString = new Serializer().serialize(person);
      serializedCustomerString = new Serializer().serialize(customer);
    });

    it('person entity should be correct', () => {
      expect(person).toBeDefined();
      expect(person.name).toBe('Giuseppe');
      expect(person.lastname).toBe('Verdi');
    });

    it('should serialize with different name', () => {
      expect(serializedPersonString).toContain('CodeArchitects.MasterData.Person');
      expect(serializedCustomerString).toContain('TheCustomer');
    });

    it('should serialize', () => {
      expect(serializedPersonString).toBeDefined();
      expect(model.Person.onSerializingCalled).toBe(true);
      expect(model.Person.onSerializedCalled).toBe(true);
    });

    it('should rename fields with renaming decorator when serialized', () => {
      expect(serializedPersonString).not.toContain('"name"');
      expect(serializedPersonString).not.toContain('"last  name"');
    });

    it('should serialize renamed fields with renamed name', () => {
      expect(serializedPersonString).toContain('"Nome"');
      expect(serializedPersonString).toContain('"Cognome"');
    });

    it('should not serialize unserializable property 1', () => {
      expect(serializedPersonString).not.toContain('doNotSerializeProperty1');
    });

    it('should not serialize unserializable property 2', () => {
      expect(serializedPersonString).not.toContain('doNotSerializeProperty2');
    });

    it('should not serialize unserializable property 3', () => {
      expect(serializedPersonString).not.toContain('doNotSerializeProperty3');
    });

    it('should not serialize unserializable field 1', () => {
      expect(serializedPersonString).not.toContain('doNotSerializeField1');
    });

    it('should not serialize unserializable field 2', () => {
      expect(serializedPersonString).not.toContain('doNotSerializeField2');
    });

    it('should not serialize unserializable field 3', () => {
      expect(serializedPersonString).not.toContain('doNotSerializeField3');
    });

    it('should not serialize not serializable fields', () => {
      expect(serializedPersonString).not.toContain('notSerializableEntitySimple');
      expect(serializedPersonString).not.toContain('notSerializableEntityPredicate');
    });

    it('should not serialize serializable fields', () => {
      expect(serializedPersonString).toContain('serializableEntitySimple');
      expect(serializedPersonString).toContain('serializableEntityPredicate');
      expect(serializedCustomerString).toContain('serializableEntitySimple');
      expect(serializedCustomerString).toContain('serializableEntityPredicate');
    });

    it('should contain decorators and decorated events should have been called', () => {
      expect(getJsonObject(person).onSerializing).toBeDefined();
      expect(getJsonObject(person).onSerialized).toBeDefined();
      expect(getJsonObject(person).onDeserializing).toBeDefined();
      expect(getJsonObject(person).onDeserialized).toBeDefined();
    });

    it('should return name of types correctly', () => {
      expect(Type.GetName(person)).toBe('CodeArchitects.MasterData.Person');
      expect(Type.getClassName(person)).toBe('Person');
    });

    it('deserialzed entity should contain decorators and decorated events should have been called', () => {
      expect(getJsonObject(person).onSerializing).toBeDefined();
      expect(getJsonObject(person).onSerialized).toBeDefined();
      expect(getJsonObject(person).onDeserializing).toBeDefined();
      expect(getJsonObject(person).onDeserialized).toBeDefined();
    });

    it('Customer metadata inherits Person metadata', () => {
      let metadataNotInherited = getJsonObject(customer, false);
      let metadataInherited = getJsonObject(customer, true);

      expect(metadataNotInherited.name).toBe('TheCustomer');
      expect(metadataInherited.name).toBe('TheCustomer');

      expect(metadataNotInherited.onSerializing).toBeUndefined();
      expect(metadataInherited.onSerializing).toBeDefined();

      expect(metadataNotInherited.onSerialized).toBeUndefined();
      expect(metadataInherited.onSerialized).toBeDefined();

      expect(metadataNotInherited.onDeserializing).toBeUndefined();
      expect(metadataInherited.onDeserializing).toBeDefined();

      expect(metadataNotInherited.onDeserialized).toBeUndefined();
      expect(metadataInherited.onDeserialized).toBeDefined();
    });

    it('serializes unknown types', () => {
      let expected = { a: 100, b: 200 };
      let serializedData = new Serializer().serialize(expected);
      let actual = new Serializer().deserialize(serializedData);
      expect(actual).toEqual(expected);
    });

    it('serializes types without metadata args serializable attributes', () => {
      let expected = new model.Simple();
      let serializedData = new Serializer().serialize(expected);
      let actual = new Serializer().deserialize(serializedData);
      expect(actual).toEqual(expected);
    });

    it('should deserialize', () => {
      let deserializedCustomer = new Serializer().deserialize(serializedCustomerString);
      expect(deserializedCustomer).toBeDefined();
      expect(model.Person.onDeserializingCalled).toBe(true);
      expect(model.Person.onDeserializedCalled).toBe(true);
    });

    it('deserialized entity should be correct', () => {
      let deserializedCustomer = new Serializer().deserialize(serializedCustomerString);
      expect(deserializedCustomer).toBeDefined();
      expect(deserializedCustomer.name).toBe('Mario');
      expect(deserializedCustomer.lastname).toBe('Rossi');
      expect(deserializedCustomer.friends).toBeInstanceOf(Array);
    });
  });

  describe('Object transformation', () => {
    let transformSetToArray: ITransformation<Set<number>, Array<number>> = {
      name: 'array',
      convertTo: (set) => Array.from(set),
      convertFrom: (array) => new Set(array)
    };

    it('transform object to target', () => {
      let actual = ConvertTo(transformSetToArray, new Set([2, 1, 4, 2, 3]));

      expect(actual.value).toEqual([2, 1, 4, 3]);
    });

    it('transform object back to source', () => {
      let actual = ConvertFrom(transformSetToArray, [2, 1, 4, 3]);
      expect(actual.value).toEqual(new Set([2, 1, 4, 3]));
    });

    it('transform forth and back of object', () => {
      let serializer = new Serializer();
      let fixture = new model.Transformable(200);

      let serialized = serializer.serialize(fixture);
      let deserialized = serializer.deserialize(serialized);

      expect(serialized).toContain('targetProperty');
      expect(serialized).not.toContain('sourceProperty');
      expect(deserialized).toEqual(fixture);
    });
  });

  describe('Property transformation', () => {
    let expectedValue = 'Franklin';
    let expectedName = 'Nome';
    let transformOnlyName: ITransformation<string, string> = { name: expectedName };
    transformOnlyName.originalName = 'name';

    let transformDegreesToRadians: ITransformation<number, number> = {
      name: 'rad',
      convertTo: (deg) => deg * Math.PI / 180,
      convertFrom: (rad) => rad * 180 / Math.PI
    };

    transformDegreesToRadians.originalName = 'deg';

    it('transform names of fields', () => {
      let actual = ConvertTo(transformOnlyName, expectedValue);

      expect(actual.value).toBe(expectedValue);
      expect(actual.name).toBe(expectedName);
    });
    it('transform names and values of fields to target values and field names', () => {
      let expectedDegrees = 90;
      let expectedRadians = expectedDegrees * Math.PI / 180;
      let actual = ConvertTo(transformDegreesToRadians, 90);

      expect(actual.value).toBe(expectedRadians);
      expect(actual.name).toBe('rad');
    });
    it('transform names and values of fields back to source name and value', () => {
      let expectedDegrees = 90;
      let actual = ConvertFrom(transformDegreesToRadians, expectedDegrees * Math.PI / 180);

      expect(actual.value).toBe(expectedDegrees);
      expect(actual.name).toBe('deg');
    });

    it('transform forth and back of fields with transformations of value and name', () => {
      let expected = new model.PositionDeg(10, 20, 45);
      let serializedData = new Serializer().serialize(expected);
      let actual = new Serializer().deserialize(serializedData);

      let expected2 = new model.OtherClassWithSameFieldsAndDifferentDecorators(1, 2, 3);
      let serializedData2 = new Serializer().serialize(expected2);
      let actual2 = new Serializer().deserialize(serializedData2);

      let expected3 = new model.OtherClassWithSameFieldsWithoutDecorators(22, 33, 44);
      let serializedData3 = new Serializer().serialize(expected3);
      let actual3 = new Serializer().deserialize(serializedData3);

      expect(serializedData).toContain('PositionRad');
      expect(serializedData).toContain('0.7853981633974483');
      expect(serializedData2).toContain(String(3 * Math.PI / 280));

      expect(serializedData3).toContain('22');
      expect(serializedData3).toContain('33');
      expect(serializedData3).toContain('44');
      // expect(serializedData3).not.toContain(String(3 * Math.PI / 280));

      expect(serializedData).not.toContain('PositionDeg');
      expect(actual).toEqual(expected);
      expect(actual2).toEqual(expected2);
      expect(actual3).toEqual(expected3);
      // expect(actual.name).toBe('deg');
    });
  });

  it('properties without decorators are not overwritten with decorators of properties ', () => {
    let expected3 = new model.OtherClassWithSameFieldsWithoutDecorators(22, 33, 44);
    let serializedData3 = new Serializer().serialize(expected3);
    let actual3 = new Serializer().deserialize(serializedData3);

    expect(serializedData3).toContain('22');
    expect(serializedData3).toContain('33');
    expect(serializedData3).toContain('44');

    expect(actual3).toEqual(expected3);
  });
});

describe('Serializer.isDeserializing test', () => {
  describe('isDeserializing bug', () => {
    let person: model.Person;
    let customer: model.Customer;

    person = new model.Person('Giuseppe', 'Verdi');
    customer = new model.Customer('Mario', 'Rossi', 30, person);
    let actual_isDeserializing_BeforeSerializing = model.Customer.isDeserializingTestValue;
    let serializedCustomer = new Serializer().serialize(customer);
    let actual_isDeserializing_AfterSerializing = model.Customer.isDeserializingTestValue;
    let deserializedCustomer = new Serializer().deserialize(serializedCustomer);
    let actual_isDeserializing_AfterDeserializing = model.Customer.isDeserializingTestValue;

    it('customer deserialization isDeserializing test', () => {
      expect(serializedCustomer).toBeDefined();
      expect(actual_isDeserializing_BeforeSerializing).toBe(false);
      expect(actual_isDeserializing_AfterSerializing).toBe(false);
      //expect(actual_isDeserializing_AfterDeserializing).toBe(true);
      expect(deserializedCustomer).not.toBeNull();
    });
  });
  describe('metadata overwrite bug', () => {
    it('metadata overwrite bug', () => {
      let expected1 = new model.Convert1('value');
      let expected2 = new model.Convert2('value');
      let expected3 = new model.Convert3('value');
      let expected4 = new model.Convert4('value');

      let s1 = new Serializer().serialize(expected1);
      let s2 = new Serializer().serialize(expected2);
      let s3 = new Serializer().serialize(expected3);
      let s4 = new Serializer().serialize(expected4);

      for (let j = 0; j < 10; j++) {
        s4 = new Serializer().serialize(expected4);
        s3 = new Serializer().serialize(expected3);
        s2 = new Serializer().serialize(expected2);
        s1 = new Serializer().serialize(expected1);
      }

      expect(s1).not.toBeNull();
      expect(s1).toContain('value1');

      expect(s2).not.toBeNull();
      expect(s2).toContain('value2');

      expect(s3).not.toBeNull();

      expect(s3).not.toContain('value1');
      expect(s3).not.toContain('value2');
      expect(s3).not.toContain('value3');
      expect(s3).not.toContain('value4');

      expect(s3).toContain('value');

      expect(s4).not.toBeNull();
      expect(s4).toContain('value4');

      let actual1: model.Convert1 = new Serializer().deserialize(s1);
      let actual2: model.Convert2 = new Serializer().deserialize(s2);
      let actual3: model.Convert3 = new Serializer().deserialize(s3);
      let actual4: model.Convert4 = new Serializer().deserialize(s4);

      // console.log('serialized data: ');

      // console.log(s1);
      // console.log(s2);
      // console.log(s3);
      // console.log(s4);

      // console.log('values: ');
      // console.log(actual1.value);
      // console.log(actual2.value);
      // console.log(actual3.value);
      // console.log(actual4.value);

      expect(actual1).toEqual(expected1);
      expect(actual2).toEqual(expected2);
      expect(actual3).toEqual(expected3);
      expect(actual4).toEqual(expected4);
    });
  });

  describe('DateTime tests', () => {
    it('convertFrom and converTo of DateTime has been called', () => {
      ObjectWithDateTime.converFromHasBeenCalled = false;
      ObjectWithDateTime.converToHasBeenCalled = false;

      let temp = new ObjectWithDateTimeBis;
      let expected = new ObjectWithDateTime;
      let temp1 = new ObjectWithDateTimeBis;
      let expected2 = new ObjectWithDateTimeBis2;

      temp.startDateTime = new Date();
      temp1.startDateTime = new Date();
      expected.startDateTime = new DateTime(Date.now());
      expected2.startDateTime = new DateTime(Date.now());

      let serialized = new Serializer().serialize(expected);
      let actual = new Serializer().deserialize(serialized) as ObjectWithDateTime;

      serialized = new Serializer().serialize(expected2);
      let actual2 = new Serializer().deserialize(serialized) as ObjectWithDateTimeBis2;

      expect(temp).not.toBeNull();
      expect(temp1).not.toBeNull();
      expect(actual).not.toBeNull();
      expect(actual.startDateTime.toISOString()).toBe(expected.startDateTime.toISOString());
      expect(actual2.startDateTime.toISOString()).toBe(expected2.startDateTime.toISOString());

      expect(ObjectWithDateTime.converToHasBeenCalled).toBe(true);
      expect(ObjectWithDateTime.converFromHasBeenCalled).toBe(true);
    });
  });
});
