import { TestBed, inject } from '@angular/core/testing';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Validation } from '../decorators/index';
import { ValidatorHelper } from './validator-helper';

class FakeValidators {
  public static notEquals(prop1Key: string, prop2key: string) {
    return (group: FormGroup) => {
      let prop1 = group.controls[prop1Key];
      let prop2 = group.controls[prop2key];

      if (prop1 && prop2 && prop1.value === prop2.value) {
        return {
          notEqual: true
        };
      }
      return;
    };
  }
}

@Validation({
  validator: FakeValidators.notEquals('firstName', 'lastName'),
  message: 'First name and last name cannot be equal'
})
class Person {
  private _firstName: string;
  private _lastName: string;

  @Validation({
    validator: Validators.required,
    message: 'First name is mandatory'
  })
  public get firstName() { return this._firstName; }
  public set firstName(value: string) { this._firstName = value; }

  public get lastName() { return this._lastName; }
  public set lastName(value: string) { this._lastName = value; }
}

class ChildPerson extends Person { }

export function main() {
  describe('Validator helper', () => {
    let validatorHelper: ValidatorHelper;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [ValidatorHelper]
      });
    });

    beforeEach(inject([ValidatorHelper], (_validatorHelpert_: ValidatorHelper) => {
      validatorHelper = _validatorHelpert_;
    }));

    describe('Base class', () => {
      let person: Person;

      beforeEach(() => {
        // Arrange
        person = new Person();
      });

      it('should return class validation params from class', () => {
        // Act
        let validaitons = validatorHelper.getValidation(Person);

        // Assert
        expect(validaitons).toBeDefined();
        expect(validaitons[0].validator).toBeDefined();
        expect(validaitons[0].message).toEqual('First name and last name cannot be equal');
      });

      it('should return class validation params from instance', () => {
        // Act
        let validaitons = validatorHelper.getValidation(person);

        // Assert
        expect(validaitons).toBeDefined();
        expect(validaitons[0].validator).toBeDefined();
        expect(validaitons[0].message).toEqual('First name and last name cannot be equal');
      });

      it('should return property validation params from class', () => {
        // Act
        let validaitons = validatorHelper.getValidation(Person, 'firstName');

        // Assert
        expect(validaitons).toBeDefined();
        expect(validaitons[0].validator).toBeDefined();
        expect(validaitons[0].message).toEqual('First name is mandatory');
      });

      it('should return property validation params from instance', () => {
        // Act
        let validaitons = validatorHelper.getValidation(person, 'firstName');

        // Assert
        expect(validaitons).toBeDefined();
        expect(validaitons[0].validator).toBeDefined();
        expect(validaitons[0].message).toEqual('First name is mandatory');
      });

      it('should return undefined if target as no descriptors', () => {
        // Act
        let validaitons = validatorHelper.getValidation(Person, 'lastName');

        // Assert
        expect(validaitons).toBeUndefined();
      });

      it('should return form control from class', () => {
        // Act
        let control = validatorHelper.getControl<string | null>(Person, 'firstName');

        // Assert
        expect(control instanceof FormControl).toBeTruthy();
      });

      it('should return form control from instance', () => {
        // Act
        let control = validatorHelper.getControl<string | null>(person, 'firstName');

        // Assert
        expect(control instanceof FormControl).toBeTruthy();
      });

      it('should return undefined control from undefined', () => {
        // Act
        let control = validatorHelper.getControl<string | null>(undefined, 'firstName');

        // Assert
        expect(control).toBeUndefined();
      });

      it('should return control validation message', () => {
        // Act
        let control = validatorHelper.getControl<string | null>(person, 'firstName');
        let message = validatorHelper.getMessage(control, 'required', person, 'firstName');

        // Assert
        expect(message).toEqual('First name is mandatory');
      });

      it('should return empty form control if target as no descriptors', () => {
        // Act
        let control = validatorHelper.getControl<string | null>(person, 'lastName');

        // Assert
        expect(control instanceof FormControl).toBeTruthy();
      });

      it('should return different control', () => {
        // Act
        let control1 = validatorHelper.getControl<string | null>(person, 'lastName');
        let control2 = validatorHelper.getControl<string | null>(person, 'lastName');

        // Assert
        expect(control1).not.toBe(control2);
      });

      it('should return form group from class', () => {
        // Act
        let group = validatorHelper.getGroup(Person);

        // Assert
        expect(group instanceof FormGroup).toBeTruthy();
      });

      it('should return form group from instance', () => {
        // Act
        let group = validatorHelper.getGroup(person);

        // Assert
        expect(group instanceof FormGroup).toBeTruthy();
      });

      it('should return undefined group from undefined', () => {
        // Act
        let group = validatorHelper.getGroup(undefined);

        // Assert
        expect(group).toBeUndefined();
      });

      it('should return group validation message', () => {
        // Act
        let group = validatorHelper.getGroup(person);
        group.addControl('firstName', validatorHelper.getControl<string | null>(person, 'firstName'));
        group.addControl('lastName', validatorHelper.getControl<string | null>(person, 'lastName'));
        let message = validatorHelper.getMessage(group, 'notEqual', person);

        // Assert
        expect(message).toEqual('First name and last name cannot be equal');
      });
    });

    describe('Derived class', () => {
      let childPerson: ChildPerson;

      beforeEach(() => {
        // Arrange
        childPerson = new ChildPerson();
      });

      it('should return class validation params from derived class', () => {
        // Act
        let validaitons = validatorHelper.getValidation(ChildPerson);

        // Assert
        expect(validaitons).toBeDefined();
        expect(validaitons[0].validator).toBeDefined();
        expect(validaitons[0].message).toEqual('First name and last name cannot be equal');
      });

      it('should return class validation params from derived instance', () => {
        // Act
        let validaitons = validatorHelper.getValidation(childPerson);

        // Assert
        expect(validaitons).toBeDefined();
        expect(validaitons[0].validator).toBeDefined();
        expect(validaitons[0].message).toEqual('First name and last name cannot be equal');
      });

      it('should return property validation params from derived class', () => {
        // Act
        let validaitons = validatorHelper.getValidation(ChildPerson, 'firstName');

        // Assert
        expect(validaitons).toBeDefined();
        expect(validaitons[0].validator).toBeDefined();
        expect(validaitons[0].message).toEqual('First name is mandatory');
      });

      it('should return property validation params from derived instance', () => {
        // Act
        let validaitons = validatorHelper.getValidation(childPerson, 'firstName');

        // Assert
        expect(validaitons).toBeDefined();
        expect(validaitons[0].validator).toBeDefined();
        expect(validaitons[0].message).toEqual('First name is mandatory');
      });

      it('should return undefined if target as no descriptors', () => {
        // Act
        let validaitons = validatorHelper.getValidation(ChildPerson, 'lastName');

        // Assert
        expect(validaitons).toBeUndefined();
      });

      it('should return form control from derived class', () => {
        // Act
        let control = validatorHelper.getControl<string | null>(ChildPerson, 'firstName');

        // Assert
        expect(control instanceof FormControl).toBeTruthy();
      });

      it('should return form control from derived instance', () => {
        // Act
        let control = validatorHelper.getControl<string | null>(childPerson, 'firstName');

        // Assert
        expect(control instanceof FormControl).toBeTruthy();
      });

      it('should return validation message', () => {
        // Act
        let control = validatorHelper.getControl<string | null>(childPerson, 'firstName');
        let message = validatorHelper.getMessage(control, 'required', childPerson, 'firstName');

        // Assert
        expect(message).toEqual('First name is mandatory');
      });

      it('should return empty form control if target as no descriptors', () => {
        // Act
        let control = validatorHelper.getControl<string | null>(childPerson, 'lastName');

        // Assert
        expect(control instanceof FormControl).toBeTruthy();
      });

      it('should return different control', () => {
        // Act
        let control1 = validatorHelper.getControl<string | null>(childPerson, 'lastName');
        let control2 = validatorHelper.getControl<string | null>(childPerson, 'lastName');

        // Assert
        expect(control1).not.toBe(control2);
      });
    });
  });
}

main();
