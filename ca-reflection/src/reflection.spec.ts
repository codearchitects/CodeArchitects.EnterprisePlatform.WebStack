import { DateTime } from '@ca-webstack/data-structures';
import { ObjectWithDateTime, ObjectWithDateTimeBis, ObjectWithDateTimeBis2 } from './fixtures/model';
// import { ObjectWithDateTime } from './fixtures/model';
import 'core-js';
import * as model from './fixtures/index';
import { Serializer, Type, ITransformation, ConvertTo, ConvertFrom } from './reflection';
import { getJsonObject } from './reflection-decorators';
import { expect } from 'chai';

Type.CacheTypes('model.', model);
describe('reflection.ts tests', () => {
  context('serialization', () => {
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
      expect(person, 'person');
      expect(person.name === 'Giuseppe', 'name is Giuseppe');
      expect(person.lastname).equal('Verdi', 'lastname is Verdi');
    });

    it('should serialize with different name', () => {
      expect(serializedPersonString.indexOf('CodeArchitects.MasterData.Person')).to.not.equal(-1, 'Person renamed to CodeArchitects.MasterData.Person');
      expect(serializedCustomerString.indexOf('TheCustomer')).to.not.equal(-1, 'Customer renamed to TheCustomer');
    });

    it('should serialize', () => {
      expect(serializedPersonString).to.not.undefined.equal(true, 'serialization');
      expect(model.Person.onSerializingCalled).equal(true, 'onSerializing == true');
      expect(model.Person.onSerializedCalled).equal(true, 'onSerialized == true');
    });

    it('should rename fields with renaming decorator when serialized', () => {
      expect(serializedPersonString.indexOf('"name"')).equal(-1, 'name changed to Nome');
      expect(serializedPersonString.indexOf('"last  name"')).equal(-1, 'lastname changed to Cognome');
    });

    it('should serialize renamed fields with renamed name', () => {
      expect(serializedPersonString.indexOf('"Nome"')).to.not.equal(-1, 'name changed to Nome');
      expect(serializedPersonString.indexOf('"Cognome"')).to.not.equal(-1, 'lastname changed to Cognome');
    });

    it('should not serialize unserializable property 1', () => {
      expect(serializedPersonString.indexOf('doNotSerializeProperty1')).equal(-1, 'doNotSerializeProperty1 field not serialized');
    });

    it('should not serialize unserializable property 2', () => {
      expect(serializedPersonString.indexOf('doNotSerializeProperty2')).equal(-1, 'doNotSerializeProperty2 field not serialized');
    });

    it('should not serialize unserializable property 3', () => {
      expect(serializedPersonString.indexOf('doNotSerializeProperty3')).equal(-1, 'doNotSerializeProperty3 field not serialized');
    });

    it('should not serialize unserializable field 1', () => {
      expect(serializedPersonString.indexOf('doNotSerializeField1')).equal(-1, 'doNotSerializeField1 field not serialized');
    });

    it('should not serialize unserializable field 2', () => {
      expect(serializedPersonString.indexOf('doNotSerializeField2')).equal(-1, 'doNotSerializeField2 field not serialized');
    });

    it('should not serialize unserializable field 3', () => {
      expect(serializedPersonString.indexOf('doNotSerializeField3')).equal(-1, 'doNotSerializeField3 field not serialized');
    });

    it('should not serialize not serializable fields', () => {
      expect(serializedPersonString.indexOf('notSerializableEntitySimple')).equal(-1, 'notSerializableEntitySimple');
      expect(serializedPersonString.indexOf('notSerializableEntityPredicate')).equal(-1, 'notSerializableEntityPredicate');
    });

    it('should not serialize serializable fields', () => {
      expect(serializedPersonString.indexOf('serializableEntitySimple')).not.equal(-1, 'serializableEntitySimple');
      expect(serializedPersonString.indexOf('serializableEntityPredicate')).not.equal(-1, 'serializableEntityPredicate');
      expect(serializedCustomerString.indexOf('serializableEntitySimple')).not.equal(-1, 'Customer/serializableEntitySimple');
      expect(serializedCustomerString.indexOf('serializableEntityPredicate')).not.equal(-1, 'Customer/serializableEntityPredicate');
    });

    it('should contain decorators and decorated events should have been called', () => {
      expect(getJsonObject(person).onSerializing, 'onSerializing');
      expect(getJsonObject(person).onSerialized, 'onSerialized');
      expect(getJsonObject(person).onDeserializing, 'onDeserializing');
      expect(getJsonObject(person).onDeserialized, 'onDeserialized');
    });

    it('should return name of types correctly', () => {
      expect(Type.GetName(person) === 'person', 'GetName is ' + Type.GetName(person));
      expect(Type.getClassName(person) === 'person', 'GetName is ' + Type.getClassName(person));
    });

    it('deserialzed entity should contain decorators and decorated events should have been called', () => {
      expect(getJsonObject(person).onSerializing, 'onSerializing');
      expect(getJsonObject(person).onSerialized, 'onSerialized');
      expect(getJsonObject(person).onDeserializing, 'onDeserializing');
      expect(getJsonObject(person).onDeserialized, 'onDeserialized');
    });

    it('Customer metadata inherits Person metadata', () => {
      let metadataNotInherited = getJsonObject(customer, false);
      let metadataInherited = getJsonObject(customer, true);

      expect(metadataNotInherited.name).equal('TheCustomer', 'TheCustomer 1');
      expect(metadataInherited.name).equal('TheCustomer', 'TheCustomer 2');

      expect(metadataNotInherited.onSerializing).equal(undefined, 'metadataNotInherited.onSerialized is undefined');
      expect(metadataInherited.onSerializing).not.equal(undefined, 'metadataInherited.onSerialized is not undefined');

      expect(metadataNotInherited.onSerialized).equal(undefined, 'metadataNotInherited.onSerialized is undefined');
      expect(metadataInherited.onSerialized).not.equal(undefined, 'metadataInherited.onSerialized is not undefined');

      expect(metadataNotInherited.onDeserializing).equal(undefined, 'metadataNotInherited.onDeserializing is undefined');
      expect(metadataInherited.onDeserializing).not.equal(undefined, 'metadataInherited.onDeserializing is not undefined');

      expect(metadataNotInherited.onDeserialized).equal(undefined, 'metadataNotInherited.onDeserialized is undefined');
      expect(metadataInherited.onDeserialized).not.equal(undefined, 'metadataInherited.onDeserialized is not undefined');
    });

    it('serializes unknown types', () => {
      let expected = { a: 100, b: 200 };
      let serializedData = new Serializer().serialize(expected);
      let actual = new Serializer().deserialize(serializedData);
      expect(actual).deep.equal(expected, 'are deep equal');
    });

    it('serializes types without metadata args serializable attributes', () => {
      let expected = new model.Simple();
      let serializedData = new Serializer().serialize(expected);
      let actual = new Serializer().deserialize(serializedData);
      expect(actual).deep.equal(expected, 'are deep equal');
    });

    it('should deserialize', () => {
      let deserializedCustomer = new Serializer().deserialize(serializedCustomerString);
      expect(deserializedCustomer).to.not.undefined.equal(true, 'deserialization');
      expect(model.Person.onDeserializingCalled).equal(true, 'onDeserializing == true');
      expect(model.Person.onDeserializedCalled).equal(true, 'onDeserialized == true');
    });

    it('deserialized entity should be correct', () => {
      let deserializedCustomer = new Serializer().deserialize(serializedCustomerString);
      expect(deserializedCustomer, 'person');
      expect(deserializedCustomer.name === 'Mario', 'name is Mario');
      expect(deserializedCustomer.lastname).equal('Rossi', 'lastname is Rossi');
      expect(deserializedCustomer.friends).to.be.instanceof(Array, 'friends is instanceof Array');
      expect(true, 'test with for executed');
    });
  });

  context('Object transformation', () => {
    let transformSetToArray: ITransformation<Set<number>, Array<number>> = {
      name: 'array',
      convertTo: (set) => Array.from(set),
      convertFrom: (array) => new Set(array)
    };

    it('transform object to target', () => {
      let actual = ConvertTo(transformSetToArray, new Set([2, 1, 4, 2, 3]));

      expect(actual.value).to.be.deep.equal([2, 1, 4, 3]);
    });

    it('transform object back to source', () => {
      let actual = ConvertFrom(transformSetToArray, [2, 1, 4, 3]);
      expect(actual.value).to.be.deep.equal(new Set([2, 1, 4, 3]));
    });

    it('transform forth and back of object', () => {
      let serializer = new Serializer();
      let fixture = new model.Transformable(200);

      let serialized = serializer.serialize(fixture);
      let deserialized = serializer.deserialize(serialized);

      expect(serialized).to.contain('targetProperty');
      expect(serialized).to.not.contain('sourceProperty');
      expect(deserialized).deep.equal(fixture);
    });
  });

  context('Property transformation', () => {
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

      expect(actual.value).to.equal(expectedValue);
      expect(actual.name).to.equal(expectedName);
    });
    it('transform names and values of fields to target values and field names', () => {
      let expectedDegrees = 90;
      let expectedRadians = expectedDegrees * Math.PI / 180;
      let actual = ConvertTo(transformDegreesToRadians, 90);

      expect(actual.value).to.equal(expectedRadians, 'expected radians');
      expect(actual.name).to.equal('rad', 'deg -> rad');
    });
    it('transform names and values of fields back to source name and value', () => {
      let expectedDegrees = 90;
      let actual = ConvertFrom(transformDegreesToRadians, expectedDegrees * Math.PI / 180);

      expect(actual.value).to.equal(expectedDegrees, 'expected radians');
      expect(actual.name).to.equal('deg', 'rad -> deg');
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

      expect(serializedData.indexOf('PositionRad')).to.not.equal(-1, 'expected PositionRad instead of PositionDeg');
      expect(serializedData.indexOf('0.7853981633974483')).to.not.equal(-1, 'should contain correct PositionRad value = 0.7853981633974483');
      expect(serializedData2.indexOf(String(3 * Math.PI / 280))).to.not.equal(-1, 'should contain correct PositionRad value = 0.03365992128846207');

      expect(serializedData3.indexOf('22')).to.not.equal(-1);
      expect(serializedData3.indexOf('33')).to.not.equal(-1);
      expect(serializedData3.indexOf('44')).to.not.equal(-1);
      // expect(serializedData3.indexOf(String(3 * Math.PI / 280))).equal(-1, 'should not contain correct PositionRad value = 0.03365992128846207');
      // expect(serializedData3.indexOf(String(3 * Math.PI / 280))).equal(-1, 'should not contain correct PositionRad value = 0.03365992128846207');

      expect(serializedData.indexOf('PositionDeg')).to.equal(-1, 'not expected PositionDeg');
      expect(actual).deep.equal(expected, 'expected equal actual');
      expect(actual2).deep.equal(expected2, 'expected2 equal actual2');
      expect(actual3).deep.equal(expected3, 'expected3 equal actual3');
      // expect(actual.name).to.equal('deg', 'rad -> deg');
    });
  });

  it('properties without decorators are not overwritten with decorators of properties ', () => {
    let expected3 = new model.OtherClassWithSameFieldsWithoutDecorators(22, 33, 44);
    let serializedData3 = new Serializer().serialize(expected3);
    let actual3 = new Serializer().deserialize(serializedData3);

    expect(serializedData3.indexOf('22')).to.not.equal(-1);
    expect(serializedData3.indexOf('33')).to.not.equal(-1);
    expect(serializedData3.indexOf('44')).to.not.equal(-1);

    expect(actual3).deep.equal(expected3, 'expected3 equal actual3');
  });
});

describe('Serializer.isDeserializing test', () => {
  context('isDeserializing bug', () => {
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
      expect(serializedCustomer).not.equal(undefined);
      expect(actual_isDeserializing_BeforeSerializing).equal(false, 'actualBeforeSerializing');
      expect(actual_isDeserializing_AfterSerializing).equal(false, 'actualAfterSerializing');
      expect(actual_isDeserializing_AfterDeserializing).equal(true, 'actualAfterDeserializing');
      expect(deserializedCustomer).not.null; //.deep.equal(customer, 'deserialized customer');
    });
  });
context('metadata overwrite bug', () => {
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

      expect(s1).to.be.not.null;
      expect(s1.indexOf('value1')).to.be.greaterThan(-1);

      expect(s2).to.be.not.null;
      expect(s2.indexOf('value2')).to.be.greaterThan(-1);

      expect(s3).to.be.not.null;

      expect(s3.indexOf('value1')).to.be.eq(-1);
      expect(s3.indexOf('value2')).to.be.eq(-1);
      expect(s3.indexOf('value3')).to.be.eq(-1);
      expect(s3.indexOf('value4')).to.be.eq(-1);

      expect(s3.indexOf('value')).to.be.greaterThan(-1);

      expect(s4).to.be.not.null;
      expect(s4.indexOf('value4')).to.be.greaterThan(-1);

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

      expect(actual1).deep.equal(expected1, '1) are deep equal');
      expect(actual2).deep.equal(expected2, '2) are deep equal');
      expect(actual3).deep.equal(expected3, '3) are deep equal');
      expect(actual4).deep.equal(expected4, '4) are deep equal');
    });
  });

  context('DateTime tests', () => {
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

      expect(temp).be.not.null;
      expect(temp1).be.not.null;
      expect(actual).be.not.null;
      expect(actual.startDateTime.toISOString()).be.equal(expected.startDateTime.toISOString());
      expect(actual2.startDateTime.toISOString()).be.equal(expected2.startDateTime.toISOString());

      expect(ObjectWithDateTime.converToHasBeenCalled).to.be.true;
      expect(ObjectWithDateTime.converFromHasBeenCalled).to.be.true;
    });
  });
});
