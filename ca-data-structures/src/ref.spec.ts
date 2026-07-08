import { Ref } from './ref';

describe('Ref', () => {
  let ref: Ref<any>;

  beforeEach(() => {
    ref = new Ref(undefined!, undefined!) as any;
  });

  it('should set and get value', () => {
    // Arrange
    const value = 'test';

    // Act
    ref.value = value;

    // Assert
    expect(ref.value).toEqual(value);
  });

  it('should set and get value with model and property', () => {
    // Arrange
    const model = { prop: 'test' };
    const prop = 'prop';
    const value = 'new value';

    // Act
    const ref = new Ref(model, prop);
    ref.value = value;

    // Assert
    expect(ref.value).toEqual(value);
    expect(model[prop]).toEqual(value);
  });

  it('should set and get value with getter and setter', () => {
    // Arrange
    let localVariable = 'initial value';
    const getter = () => localVariable;
    const setter = (val: string) => {
      localVariable = val;
    };
    const value = 'new value';

    // Act
    const ref = new Ref(getter, setter);
    ref.value = value;

    // Assert
    expect(ref.value).toEqual(value);
    expect(localVariable).toEqual(value);
  });
});