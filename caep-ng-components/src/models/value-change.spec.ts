import { EventEmitter } from '@angular/core';
import { CaepValueChange } from './value-change';

describe('CaepValueChange', () => {
  let valueChange: CaepValueChange<string>,
    model: { [id: string]: any },
    prop = 'prop3',
    nextValue = 'test3',
    valueChangesEmitter: EventEmitter<string>;

  beforeEach(() => {
    model = { prop1: 0, prop2: 'test2' };
    valueChangesEmitter = new EventEmitter<string>();
  });

  it('should create valueChange request object', () => {
    valueChange = new CaepValueChange(model, prop, nextValue, valueChangesEmitter);
    expect(valueChange).toBeDefined();
    expect(valueChange).toBeInstanceOf(CaepValueChange);
    expect(valueChange.nextValue).toEqual(nextValue);
    expect(valueChange.valueChangesEmitter).toBe(valueChangesEmitter);
  });

  describe('currentValue', () => {
    it('should return undefined if model property is not defined yet', () => {
      valueChange = new CaepValueChange(model, prop, nextValue, valueChangesEmitter);
      expect(valueChange.currentValue).toBeUndefined();
    });

    it('should return the correct value if model property is already defined', () => {
      valueChange = new CaepValueChange(model, 'prop2', nextValue, valueChangesEmitter);
      expect(valueChange.currentValue).toEqual(model.prop2);
    });
  });

  describe('authorize', () => {
    it('should set property value and emit value change event', (done: Function) => {
      valueChange = new CaepValueChange(model, prop, nextValue, valueChangesEmitter);
      valueChangesEmitter.subscribe((value: string) => {
        expect(model[prop]).toEqual(nextValue);
        expect(value).toEqual(nextValue);
        done();
      });
      valueChange.authorize();
    });
  });

  it('should not set property value and emit value change if authorize method is not called', () => {
    valueChange = new CaepValueChange(model, prop, nextValue, valueChangesEmitter);
    const spyValueChangesEmit = spyOn(valueChangesEmitter, 'emit');
    expect(model[prop]).not.toEqual(nextValue);
    expect(model[prop]).toEqual(valueChange.currentValue);
    expect(spyValueChangesEmit).not.toHaveBeenCalled();
  });
});
