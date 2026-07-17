import { JsonObject, JsonProperty, JsonIgnore } from '../reflection-decorators';
// import { JsonObject } from '../reflection-decorators';
import { Serializer } from '../reflection';
import { DateTime } from '@ca-webstack/data-structures';

@JsonObject()
export class CommonBase {
}

@JsonObject({
  name: 'CodeArchitects.MasterData.BaseEntity'
})
export class BaseEntity {
  @JsonIgnore()
  public doNotSerializeField3: string = 'hello world!!';

  // @JsonProperty({debug: true, canSerialize: false})
  @JsonIgnore()
  public get doNotSerializeProperty3() { return this._doNotSerializePropertyValue3; };
  public set doNotSerializeProperty3(value: string) { this._doNotSerializePropertyValue3 = value; };

  private _doNotSerializePropertyValue3: string = 'hello world!';
}

@JsonObject({
  name: 'CodeArchitects.MasterData.BasePersonEntity'
  // , extends: BaseEntity
})
export class BasePersonEntity extends BaseEntity {
  @JsonIgnore()
  public doNotSerializeField2: string = 'hello world!!';

  @JsonIgnore()
  public get doNotSerializeProperty2() { return this._doNotSerializePropertyValue2; };
  public set doNotSerializeProperty2(value: string) { this._doNotSerializePropertyValue2 = value; };

  private _doNotSerializePropertyValue2: string = 'hello world!';
}

@JsonObject({
  name: 'CodeArchitects.MasterData.Person',
  onSerializing: (person) => Person.onSerializingCalled = true,
  onSerialized: (person) => Person.onSerializedCalled = true,
  onDeserializing: (person) => Person.onDeserializingCalled = true,
  onDeserialized: (person) => Person.onDeserializedCalled = true
  // , extends: BasePersonEntity
})
export class Person extends BasePersonEntity {
  static onSerializingCalled: boolean = false;
  static onSerializedCalled: boolean = false;
  static onDeserializingCalled: boolean = false;
  static onDeserializedCalled: boolean = false;

  @JsonIgnore()
  public doNotSerializeField1: string = 'hello world!!';

  @JsonIgnore()
  public get doNotSerializeProperty1() { return this._doNotSerializePropertyValue1; };
  public set doNotSerializeProperty1(value: string) { this._doNotSerializePropertyValue1 = value; };

  @JsonProperty({
    transformation: { name: 'Nome' }
  })
  public name?: string;

  @JsonProperty({
    transformation: { name: 'Cognome' }
  })
  public lastname?: string;
  public serializableEntitySimple: SerializableEntitySimple = new SerializableEntitySimple();
  public notSerializableEntitySimple: NotSerializableEntitySimple = new NotSerializableEntitySimple();
  public serializableEntityPredicate: SerializableEntityWithPredicate = new SerializableEntityWithPredicate();
  public notSerializableEntityPredicate: NotSerializableEntityWithPredicate = new NotSerializableEntityWithPredicate();

  private _doNotSerializePropertyValue1: string = 'hello world!';

  constructor(name?: string, lastname?: string) {
    super();
    this.name = name;
    this.lastname = lastname;
  }
  public Foo() {
    console.log('Person');
  }
}

@JsonObject({ name: 'PositionRad' })
export class PositionDeg extends CommonBase {
  public static canSerializeCalled: boolean = false;
  public x: number;
  public y: number;

  @JsonProperty({
    transformation: {
      name: 'angleRad',
      convertFrom: rad => rad * 180 / Math.PI,
      convertTo: deg => deg * Math.PI / 180
    }
  })
  public angleDeg: number;

  constructor(x: number, y: number, angleDeg: number) {
    super();
    this.x = x;
    this.y = y;
    this.angleDeg = angleDeg;
  }
}

@JsonObject({ name: 'PositionRad2' })
export class OtherClassWithSameFieldsAndDifferentDecorators extends CommonBase {
  public static canSerializeCalled: boolean = false;
  public x: number;
  public y: number;

  @JsonProperty({
    // debug: true,
    transformation: {
      name: 'angleRad',
      convertFrom: rad => rad * 280 / Math.PI,
      convertTo: deg => deg * Math.PI / 280
    }
  })
  public angleDeg: number;

  constructor(x: number, y: number, angleDeg: number) {
    super();
    this.x = x;
    this.y = y;
    this.angleDeg = angleDeg;
  }
}

@JsonObject({ name: 'PositionDeg' })
export class OtherClassWithSameFieldsWithoutDecorators extends CommonBase {
  public static canSerializeCalled: boolean = false;
  public x: number;
  public y: number;

  // TODO: =DG= this must work without the following empty JsonProperty
  // @JsonProperty()
  public angleDeg: number;

  constructor(x: number, y: number, angleDeg: number) {
    super();
    this.x = x;
    this.y = y;
    this.angleDeg = angleDeg;
  }
}

@JsonObject({
  name: 'TheCustomer',
  canSerialize: (e) => { Customer.canSerializeCalled = true; return true; }
})
export class Customer extends Person {
  public static canSerializeCalled: boolean = false;
  public static isDeserializingTestValue: boolean = false;
  private _age: number;
  private _friends: Person[];

  constructor(name: string, lastname: string, age: number, ...person: Person[]) {
    super(name, lastname);
    this._age = age;
    this._friends = person;
  }

  public get age(): number {
    return this._age;
  }
  public set age(value: number) {
    Customer.isDeserializingTestValue = Customer.isDeserializingTestValue || Serializer.isDeserializing;
    this._age = value;
  }

  public get friends(): Person[] {
    return this._friends;
  }
  public set friends(value: Person[]) {
    this._friends = value;
  }

  public Foo() {
    super.Foo();
    console.log('Customer');
  }
}

@JsonObject({
  canSerialize: true
  // debug: true
})
export class SerializableEntitySimple {
  constructor(public tag: string = new Date().toString()) {
  }
}

@JsonObject({
  canSerialize: false
})
export class NotSerializableEntitySimple {
  constructor(public tag: string = new Date().toString()) {
  }
}

@JsonObject<SerializableEntityWithPredicate>({
  canSerialize: (entity) => {
    return SerializableEntityWithPredicate.NotSerializableEntityWithPredicateValue = true;
  }
})
export class SerializableEntityWithPredicate {
  public static NotSerializableEntityWithPredicateValue: boolean;
  constructor(public tag: string = new Date().toString()) {
  }
}

@JsonObject<NotSerializableEntityWithPredicate>({
  canSerialize: (entity) => {
    return NotSerializableEntityWithPredicate.NotSerializableEntityWithPredicateValue = false;
  }
})
export class NotSerializableEntityWithPredicate {
  public static NotSerializableEntityWithPredicateValue: boolean;
  constructor(public tag: string = new Date().toString()) {
  }
}

@JsonObject()
export class Simple {
  public A = 100;
  public B = 200;
}

@JsonObject({
  name: 'Transformable',
  convertTo: (obj) => ({ targetProperty: obj.sourceProperty }),
  convertFrom: (json) => new Transformable(json.targetProperty)
})
export class Transformable {
  private _sourceProperty: number;

  public constructor(sourceProperty: number) {
    this._sourceProperty = sourceProperty;
  }

  public get sourceProperty() { return this._sourceProperty; }
  public set sourceProperty(value: number) { this._sourceProperty = value; }
}

@JsonObject({name: 'ObjectWithDateTime'})
export class ObjectWithDateTime extends CommonBase {
  static converToHasBeenCalled = false;
  static converFromHasBeenCalled = false;

  private _startDateTime: DateTime;

  @JsonProperty({
    transformation: {
      name: 'dataInizio',
      convertTo: (dt) => { debugger; ObjectWithDateTime.converToHasBeenCalled = true; return dt && dt.toISOString(); },
      convertFrom: (str) => {debugger; ObjectWithDateTime.converFromHasBeenCalled = true; return new DateTime(str); }
    }
  })
  public get startDateTime(): DateTime { return this._startDateTime; }
  public set startDateTime(value: DateTime) { this._startDateTime = value; }

  constructor() {
    super();
  }
}

@JsonObject()
export class ObjectWithDateTimeBis {
  private _startDateTime: Date;

  public get startDateTime(): Date { return this._startDateTime; }
  public set startDateTime(value: Date) { this._startDateTime = value; }
}

@JsonObject()
export class ObjectWithDateTimeBis2 {
  private _startDateTime: DateTime;

  @JsonProperty({
    transformation: {
      name: 'dataInizio',
      convertTo: (dt) => { debugger; ObjectWithDateTime.converToHasBeenCalled = true; return dt && dt.toISOString(); },
      convertFrom: (str) => {debugger; ObjectWithDateTime.converFromHasBeenCalled = true; return new DateTime(str); }
    }
  })
  public get startDateTime(): DateTime { return this._startDateTime; }
  public set startDateTime(value: DateTime) { this._startDateTime = value; }
}


@JsonObject()
export class ObjectWithDateTimeBis3 {
  private _startDateTime: DateTime;

  @JsonProperty({
    transformation: {
      name: 'dataInizio',
      convertTo: (dt) => { debugger; ObjectWithDateTime.converToHasBeenCalled = true; return dt && dt.toISOString(); },
      convertFrom: (str) => {debugger; ObjectWithDateTime.converFromHasBeenCalled = true; return new DateTime(str); }
    }
  })
  public get startDateTime(): DateTime { return this._startDateTime; }
  public set startDateTime(value: DateTime) { this._startDateTime = value; }
}
