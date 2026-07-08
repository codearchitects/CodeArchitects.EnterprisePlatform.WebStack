import { CaepCoerceArrayString, CaepCoerceBoolean, CaepCoerceCssPixel, CaepCoerceNumber } from './coercion.decorator';

class DummyClass {
  @CaepCoerceBoolean()
  public enable: any = false;

  @CaepCoerceCssPixel()
  public width: string | number;

  @CaepCoerceArrayString()
  public containerClass: string | string[] = '';

  @CaepCoerceNumber()
  public maxLength: number | string;

  constructor() {}
}

describe('Coercion decorators', () => {
  let dummyInstance: DummyClass;

  beforeEach(() => {
    dummyInstance = new DummyClass();
  });

  describe('CaepCoerceBoolean decorator', () => {
    it('should return a function', () => {
      const actualValue = CaepCoerceBoolean();
      expect(actualValue).toBeInstanceOf(Function);
    });

    it('should coerce a defined object to boolean true value', () => {
      const obj = {};
      dummyInstance.enable = obj;
      expect(dummyInstance.enable).toBeTrue();
    });

    it('should coerce a number to boolean true value', () => {
      dummyInstance.enable = 0;
      expect(dummyInstance.enable).toBeTrue();
    });

    it('should coerce the string "true" to boolean true value', () => {
      dummyInstance.enable = 'true';
      expect(dummyInstance.enable).toBeTrue();
    });

    it('should coerce the string "false" to boolean false value', () => {
      dummyInstance.enable = 'false';
      expect(dummyInstance.enable).toBeFalse();
    });

    it('should coerce a null value to boolean false value', () => {
      dummyInstance.enable = null;
      expect(dummyInstance.enable).toBeFalse();
    });

    it('should coerce an undefined value to boolean false value', () => {
      dummyInstance.enable = undefined;
      expect(dummyInstance.enable).toBeFalse();
    });

    it('should define on the prototype object of the decorated class an "enable" property with getter and setter', () => {
      dummyInstance.enable = true;
      const prototype = Object.getPrototypeOf(dummyInstance);
      const propertyDescriptor = Object.getOwnPropertyDescriptor(prototype, 'enable');
      expect(propertyDescriptor.get).toBeDefined();
      expect(propertyDescriptor.set).toBeDefined();
    });

    it('should define on the decorated class a new member "__enable"', () => {
      dummyInstance.enable = true;
      expect(dummyInstance['__enable']).toBeDefined();
      expect(dummyInstance['__enable']).toBeTrue();
    });
  });

  describe('CaepCoerceCssPixel decorator', () => {
    it('should return a function', () => {
      const actualValue = CaepCoerceCssPixel();
      expect(actualValue).toBeInstanceOf(Function);
    });

    it('should coerce a number to string css pixel value', () => {
      dummyInstance.width = 500;
      const expectedValue = '500px';
      expect(dummyInstance.width as any).toEqual(expectedValue);
    });

    it('should define on the prototype object of the decorated class a "width" property with getter and setter', () => {
      dummyInstance.width = '500px';
      const prototype = Object.getPrototypeOf(dummyInstance);
      const propertyDescriptor = Object.getOwnPropertyDescriptor(prototype, 'width');
      expect(propertyDescriptor.get).toBeDefined();
      expect(propertyDescriptor.set).toBeDefined();
    });

    it('should define on the decorated class a new member "__width"', () => {
      dummyInstance.width = 500;
      const expectedValue = '500px';
      expect(dummyInstance['__width']).toBeDefined();
      expect(dummyInstance['__width']).toEqual(expectedValue);
    });
  });

  describe('CaepCoerceNumber decorator', () => {
    it('should return a function', () => {
      const actualValue = CaepCoerceNumber();
      expect(actualValue).toBeInstanceOf(Function);
    });

    it('should coerce a string to a number value', () => {
      dummyInstance.maxLength = '30';
      const expectedValue = 30;
      expect(dummyInstance.maxLength as any).toEqual(expectedValue);
    });

    it('should coerce a non-numeric string to 0', () => {
      dummyInstance.maxLength = 'test';
      const expectedValue = 0;
      expect(dummyInstance.maxLength as any).toEqual(expectedValue);
    });

    it('should coerce an undefined value to 0', () => {
      dummyInstance.maxLength = undefined;
      const expectedValue = 0;
      expect(dummyInstance.maxLength).toEqual(expectedValue);
    });

    it('should coerce a null value to 0', () => {
      dummyInstance.maxLength = null;
      const expectedValue = 0;
      expect(dummyInstance.maxLength).toEqual(expectedValue);
    });

    it('should define on the prototype object of the decorated class a "maxLength" property with getter and setter', () => {
      dummyInstance.maxLength = '30';
      const prototype = Object.getPrototypeOf(dummyInstance);
      const propertyDescriptor = Object.getOwnPropertyDescriptor(prototype, 'maxLength');
      expect(propertyDescriptor.get).toBeDefined();
      expect(propertyDescriptor.set).toBeDefined();
    });

    it('should define on the decorated class a new member "__maxLength"', () => {
      dummyInstance.maxLength = '30';
      const expectedValue = 30;
      expect(dummyInstance['__maxLength']).toBeDefined();
      expect(dummyInstance['__maxLength']).toEqual(expectedValue);
    });
  });

  describe('CaepCoerceArrayString decorator', () => {
    it('should return a function', () => {
      const actualValue = CaepCoerceArrayString();
      expect(actualValue).toBeInstanceOf(Function);
    });

    it('should coerce a string array to a string', () => {
      dummyInstance.containerClass = ['my-class1', 'my-class2', 'my-class3'];
      const expectedValue = 'my-class1 my-class2 my-class3';
      expect(dummyInstance.containerClass).toEqual(expectedValue);
    });

    it('should define on the prototype object of the decorated class a "containerClass" property with getter and setter', () => {
      dummyInstance.containerClass = 'my-class1 my-class2 my-class3';
      const prototype = Object.getPrototypeOf(dummyInstance);
      const propertyDescriptor = Object.getOwnPropertyDescriptor(prototype, 'containerClass');
      expect(propertyDescriptor.get).toBeDefined();
      expect(propertyDescriptor.set).toBeDefined();
    });

    it('should define on the decorated class a new member "__containerClass"', () => {
      dummyInstance.containerClass = ['my-class1', 'my-class2', 'my-class3'];
      const expectedValue = 'my-class1 my-class2 my-class3';
      expect(dummyInstance['__containerClass']).toBeDefined();
      expect(dummyInstance['__containerClass']).toEqual(expectedValue);
    });
  });
});
