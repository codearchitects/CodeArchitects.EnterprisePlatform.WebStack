import { CaepCoercionType, CaepOption } from './option.decorator';

class DummyClass {
  @CaepOption({ defaultValue: '' })
  public placeholder: string;

  @CaepOption({ defaultValue: false, coercionType: CaepCoercionType.Boolean })
  public isReadonly: any;

  @CaepOption({ coercionType: CaepCoercionType.Number })
  public maxLength: number | string;

  @CaepOption({ coercionType: CaepCoercionType.CssPixel })
  public width: string | number;

  @CaepOption({ coercionType: CaepCoercionType.ArrayToString })
  public containerClass: string | string[];

  constructor() {}
}

describe('CaepOption decorator', () => {
  let dummyInstance: DummyClass;

  beforeEach(() => {
    dummyInstance = new DummyClass();
  });

  it('should return a function', () => {
    const actualValue = CaepOption({});
    expect(actualValue).toBeInstanceOf(Function);
  });

  it('should set placeholder default value', () => {
    const expectedDefaultPlaceholder = '',
      expectedNewPlaceholder = 'Placeholder';
    expect(dummyInstance.placeholder).toEqual(expectedDefaultPlaceholder);
    dummyInstance.placeholder = expectedNewPlaceholder;
    expect(dummyInstance.placeholder).toEqual(expectedNewPlaceholder);
  });

  it('should set isReadOnly default value and support boolean coercion', () => {
    const expectedIsReadonly = false;
    expect(dummyInstance.isReadonly).toEqual(expectedIsReadonly);
    dummyInstance.isReadonly = 'true';
    expect(dummyInstance.isReadonly).toBeTrue();
  });

  it('should support number coercion', () => {
    const expectedValue = 30;
    dummyInstance.maxLength = '30';
    expect(dummyInstance.maxLength as any).toEqual(expectedValue);
  });

  it('should support css pixel coercion', () => {
    const expectedValue = '500px';
    dummyInstance.width = 500;
    expect(dummyInstance.width as any).toEqual(expectedValue);
  });

  it('should support string array coercion', () => {
    const expectedValue = 'my-class1 my-class2 my-class3';
    dummyInstance.containerClass = ['my-class1', 'my-class2', 'my-class3'];
    expect(dummyInstance.containerClass).toEqual(expectedValue);
  });

  it('should define on the prototype object of the decorated class a "placeholder" property with getter and setter', () => {
    const prototype = Object.getPrototypeOf(dummyInstance);
    const propertyDescriptor = Object.getOwnPropertyDescriptor(prototype, 'placeholder');
    expect(propertyDescriptor.get).toBeDefined();
    expect(propertyDescriptor.set).toBeDefined();
  });

  it('should define on the decorated class a new member "__placeholder"', () => {
    const expectedPlaceholeder = 'Placeholder';
    dummyInstance.placeholder = expectedPlaceholeder;
    expect(dummyInstance['__placeholder']).toBeDefined();
    expect(dummyInstance['__placeholder']).toEqual(expectedPlaceholeder);
  });
});
