import { Ref, IRef } from './ref';

class Person {
  constructor(public name: string, public surname: string, public age: number) { };
}

describe('Ref Suite', () => {
  const person = new Person('Mario', 'Rossi', 35);

  test('should be defined', () => {
    const actual = Ref;
    expect(actual).toBeDefined();
  });

  test('should correctly referentiate the "name" property of the "Person" class instance', () => {
    const actual = new Ref(person, 'name');
    expect(actual).toBeDefined();
    expect(actual.value).toEqual(person.name);
  });

  test('should correctly change the "name" property of the "Person" class instance by reference', () => {
    const ref = new Ref(person, 'name');
    ref.value = 'Luca';
    const actual = ref.value;
    expect(actual).toEqual('Luca');
    expect(actual).toEqual(person.name);
  });

  test('should correctly change the "age" property of the "Person" class instance by reference', () => {
    const ref = new Ref(person, 'age');
    ref.value = 22;
    const actual = ref.value;
    expect(actual).toEqual(22);
    expect(actual).toEqual(person.age);
  });

  test('should correctly change locally the "name" property of the "Person" class instance by value', () => {
    const sampleFunction = (name: IRef<string>) => {
      name.value = 'Gianni';
    };
    const ref = new Ref(person.name);
    sampleFunction(ref);
    const actual = ref.value;
    expect(actual).toEqual('Gianni');
    expect(person.name).not.toEqual(actual);
  });

  test('should correctly change the "foo" local property value to "bar"', () => {
    let foo = 'foo';
    const sampleFunction = (x: IRef<string>) => {
      x.value = 'bar';
    };
    const ref = new Ref(() => foo, val => foo = val);
    sampleFunction(ref);
    const actual = ref.value;
    expect(actual).toEqual('bar');
    expect(foo).toEqual(actual);
  });
});