import { TestBed, inject } from '@angular/core/testing';
import { UpperCasePipe } from '@angular/common';
import { Aspect } from '../decorators/index';
import { Context } from '../models/index';
import { AspectHelper } from './aspect-helper';

class Person {
  private _firstName: string;
  private _lastName: string;

  @Aspect({
    default: {
      label: 'Name',
      template: 'sh-text',
      converters: UpperCasePipe
    },
    browse: {
      label: 'First name'
    }
  })
  public get firstName() { return this._firstName; }
  public set firstName(value: string) { this._firstName = value; }

  public get lastName() { return this._lastName; }
  public set lastName(value: string) { this._lastName = value; }
}

class ChildPerson extends Person { }

export function main() {
  describe('Aspect helper', () => {

    let aspectHelper: AspectHelper;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [AspectHelper]
      });
    });

    beforeEach(inject([AspectHelper], (_aspectHelpert_: AspectHelper) => {
      aspectHelper = _aspectHelpert_;
    }));

    describe('Base class', () => {

      let person: Person;

      beforeEach(() => {
        // Arrange
        person = new Person();
      });

      it('should return property aspect params from class', () => {
        // Act
        let aspect = aspectHelper.getAspect(Person, 'firstName');

        // Assert
        expect(aspect).toBeDefined();
        expect(aspect.default).toBeDefined();
        expect(aspect.default.label).toEqual('Name');
        expect(aspect.default.template).toEqual('sh-text');
        expect(aspect.default.converters).toEqual(UpperCasePipe);
        expect(aspect.browse).toBeDefined();
        expect(aspect.browse.label).toEqual('First name');
      });

      it('should return property aspect params from instance', () => {
        // Act
        let aspect = aspectHelper.getAspect(person, 'firstName');

        // Assert
        expect(aspect).toBeDefined();
        expect(aspect.default).toBeDefined();
        expect(aspect.default.label).toEqual('Name');
        expect(aspect.default.template).toEqual('sh-text');
        expect(aspect.default.converters).toEqual(UpperCasePipe);
        expect(aspect.browse).toBeDefined();
        expect(aspect.browse.label).toEqual('First name');
      });

      it('should return property label from class with default context', () => {
        // Act
        let label = aspectHelper.getLabel(Person, 'firstName');

        // Assert
        expect(label).toEqual('Name');
      });

      it('should return property label from instance with default context', () => {
        // Act
        let label = aspectHelper.getLabel(person, 'firstName');

        // Assert
        expect(label).toEqual('Name');
      });

      it('should return property label from class with specific context', () => {
        // Act
        let label = aspectHelper.getLabel(Person, 'firstName', Context.browse);

        // Assert
        expect(label).toEqual('First name');
      });

      it('should return property label from instance with specific context', () => {
        // Act
        let label = aspectHelper.getLabel(person, 'firstName', Context.browse);

        // Assert
        expect(label).toEqual('First name');
      });

      it('should return property label from class with absent specific context', () => {
        // Act
        let label = aspectHelper.getLabel(Person, 'firstName', Context.edit);

        // Assert
        expect(label).toEqual('Name');
      });

      it('should return property label from instance with absent specific context', () => {
        // Act
        let label = aspectHelper.getLabel(person, 'firstName', Context.edit);

        // Assert
        expect(label).toEqual('Name');
      });

      it('should return property template from class with default context', () => {
        // Act
        let template = aspectHelper.getTemplate(Person, 'firstName');

        // Assert
        expect(template).toEqual('sh-text');
      });

      it('should return property template from instance with default context', () => {
        // Act
        let template = aspectHelper.getTemplate(person, 'firstName');

        // Assert
        expect(template).toEqual('sh-text');
      });

      it('should return property template from class with specific context', () => {
        // Act
        let template = aspectHelper.getTemplate(Person, 'firstName', Context.browse);

        // Assert
        expect(template).toEqual('sh-text');
      });

      it('should return property template from instance with specific context', () => {
        // Act
        let template = aspectHelper.getTemplate(person, 'firstName', Context.browse);

        // Assert
        expect(template).toEqual('sh-text');
      });

      it('should return property template from class with absent specific context', () => {
        // Act
        let template = aspectHelper.getTemplate(Person, 'firstName', Context.edit);

        // Assert
        expect(template).toEqual('sh-text');
      });

      it('should return property template from instance with absent specific context', () => {
        // Act
        let template = aspectHelper.getTemplate(person, 'firstName', Context.edit);

        // Assert
        expect(template).toEqual('sh-text');
      });

      it('should return property converters from class with default context', () => {
        // Act
        let converters = aspectHelper.getConverters(Person, 'firstName');

        // Assert
        expect(converters instanceof UpperCasePipe).toBeTruthy();
      });

      it('should return property converters from instance with default context', () => {
        // Act
        let converters = aspectHelper.getConverters(person, 'firstName');

        // Assert
        expect(converters instanceof UpperCasePipe).toBeTruthy();
      });

      it('should return property converters from class with specific context', () => {
        // Act
        let converters = aspectHelper.getConverters(Person, 'firstName', Context.browse);

        // Assert
        expect(converters instanceof UpperCasePipe).toBeTruthy();
      });

      it('should return property converters from instance with specific context', () => {
        // Act
        let converters = aspectHelper.getConverters(person, 'firstName', Context.browse);

        // Assert
        expect(converters instanceof UpperCasePipe).toBeTruthy();
      });

      it('should return property converters from class with absent specific context', () => {
        // Act
        let converters = aspectHelper.getConverters(Person, 'firstName', Context.edit);

        // Assert
        expect(converters instanceof UpperCasePipe).toBeTruthy();
      });

      it('should return property converters from instance with absent specific context', () => {
        // Act
        let converters = aspectHelper.getConverters(person, 'firstName', Context.edit);

        // Assert
        expect(converters instanceof UpperCasePipe).toBeTruthy();
      });
    });

    describe('Derived class', () => {

      let childPerson: ChildPerson;

      beforeEach(() => {
        // Arrange
        childPerson = new ChildPerson();
      });

      it('should return property aspect params from class', () => {
        // Act
        let aspect = aspectHelper.getAspect(ChildPerson, 'firstName');

        // Assert
        expect(aspect).toBeDefined();
        expect(aspect.default).toBeDefined();
        expect(aspect.default.label).toEqual('Name');
        expect(aspect.default.template).toEqual('sh-text');
        expect(aspect.default.converters).toEqual(UpperCasePipe);
        expect(aspect.browse).toBeDefined();
        expect(aspect.browse.label).toEqual('First name');
      });

      it('should return property aspect params from instance', () => {
        // Act
        let aspect = aspectHelper.getAspect(childPerson, 'firstName');

        // Assert
        expect(aspect).toBeDefined();
        expect(aspect.default).toBeDefined();
        expect(aspect.default.label).toEqual('Name');
        expect(aspect.default.template).toEqual('sh-text');
        expect(aspect.default.converters).toEqual(UpperCasePipe);
        expect(aspect.browse).toBeDefined();
        expect(aspect.browse.label).toEqual('First name');
      });

      it('should return property label from class with default context', () => {
        // Act
        let label = aspectHelper.getLabel(ChildPerson, 'firstName');

        // Assert
        expect(label).toEqual('Name');
      });

      it('should return property label from instance with default context', () => {
        // Act
        let label = aspectHelper.getLabel(childPerson, 'firstName');

        // Assert
        expect(label).toEqual('Name');
      });

      it('should return property label from class with specific context', () => {
        // Act
        let label = aspectHelper.getLabel(ChildPerson, 'firstName', Context.browse);

        // Assert
        expect(label).toEqual('First name');
      });

      it('should return property label from instance with specific context', () => {
        // Act
        let label = aspectHelper.getLabel(childPerson, 'firstName', Context.browse);

        // Assert
        expect(label).toEqual('First name');
      });

      it('should return property label from class with absent specific context', () => {
        // Act
        let label = aspectHelper.getLabel(ChildPerson, 'firstName', Context.edit);

        // Assert
        expect(label).toEqual('Name');
      });

      it('should return property label from instance with absent specific context', () => {
        // Act
        let label = aspectHelper.getLabel(childPerson, 'firstName', Context.edit);

        // Assert
        expect(label).toEqual('Name');
      });

      it('should return property template from class with default context', () => {
        // Act
        let template = aspectHelper.getTemplate(ChildPerson, 'firstName');

        // Assert
        expect(template).toEqual('sh-text');
      });

      it('should return property template from instance with default context', () => {
        // Act
        let template = aspectHelper.getTemplate(childPerson, 'firstName');

        // Assert
        expect(template).toEqual('sh-text');
      });

      it('should return property template from class with specific context', () => {
        // Act
        let template = aspectHelper.getTemplate(ChildPerson, 'firstName', Context.browse);

        // Assert
        expect(template).toEqual('sh-text');
      });

      it('should return property template from instance with specific context', () => {
        // Act
        let template = aspectHelper.getTemplate(childPerson, 'firstName', Context.browse);

        // Assert
        expect(template).toEqual('sh-text');
      });

      it('should return property template from class with absent specific context', () => {
        // Act
        let template = aspectHelper.getTemplate(ChildPerson, 'firstName', Context.edit);

        // Assert
        expect(template).toEqual('sh-text');
      });

      it('should return property template from instance with absent specific context', () => {
        // Act
        let template = aspectHelper.getTemplate(childPerson, 'firstName', Context.edit);

        // Assert
        expect(template).toEqual('sh-text');
      });

      it('should return property converters from class with default context', () => {
        // Act
        let converters = aspectHelper.getConverters(ChildPerson, 'firstName');

        // Assert
        expect(converters instanceof UpperCasePipe).toBeTruthy();
      });

      it('should return property converters from instance with default context', () => {
        // Act
        let converters = aspectHelper.getConverters(childPerson, 'firstName');

        // Assert
        expect(converters instanceof UpperCasePipe).toBeTruthy();
      });

      it('should return property converters from class with specific context', () => {
        // Act
        let converters = aspectHelper.getConverters(ChildPerson, 'firstName', Context.browse);

        // Assert
        expect(converters instanceof UpperCasePipe).toBeTruthy();
      });

      it('should return property converters from instance with specific context', () => {
        // Act
        let converters = aspectHelper.getConverters(childPerson, 'firstName', Context.browse);

        // Assert
        expect(converters instanceof UpperCasePipe).toBeTruthy();
      });

      it('should return property converters from class with absent specific context', () => {
        // Act
        let converters = aspectHelper.getConverters(ChildPerson, 'firstName', Context.edit);

        // Assert
        expect(converters instanceof UpperCasePipe).toBeTruthy();
      });

      it('should return property converters from instance with absent specific context', () => {
        // Act
        let converters = aspectHelper.getConverters(childPerson, 'firstName', Context.edit);

        // Assert
        expect(converters instanceof UpperCasePipe).toBeTruthy();
      });
    });
  });
}

main();
