import { IObjectWithChangeTracker, ObjectChangeTracker, ObjectState } from '@ca-webstack/change-tracker';
import { Entity } from '../../decorators';

export class Person {
  protected _name: string;
  protected _birthday: Date;
  protected _date: Date;

  public get name() { return this._name; }
  public set name(value: string) { this._name = value; }

  public get birthday() { return this._birthday; }
  public set birthday(value: Date) { this._birthday = value; }
  public get date() {
    if (!this._date) this._date = new Date();
    return this._date;
  }
}

export class PersonWithAge extends Person {
  private _age: number;

  // constructor() {
  //   super();
  // }

  public get age() { return this._age; }
  public set age(value: number) { this._age = value; }
}

export class PersonWithAddress extends Person {
  private _address: Address;

  get address() { return this._address; }
  set address(value: Address) { this._address = value; }
}

export class PersonWithAddresses extends Person {
  private _addresses: Array<Address>;

  get addresses() { return this._addresses; }
  set addresses(value: Array<Address>) { this._addresses = value; }
}

export class Address {
  private _street: string;

  public get street() { return this._street; }
  public set street(value: string) { this._street = value; }
}

@Entity({
  name: 'TrackedPerson',
  keys: '_id'
})
export class TrackedPerson extends Person implements IObjectWithChangeTracker {

  private _id: number;
  private _changeTracker: ObjectChangeTracker;

  public get id() { return this._id; }
  public set id(value: number) { this._id = value; }

  public get name() { return this._name; }
  public set name(value: string) {
    if (this.name !== value) {
      this.changeTracker.recordOriginalValue('name', this._name);
      this._name = value;
      this.onPropertyChanged('name');
    }
  }

  public get birthday() { return this._birthday; }
  public set birthday(value: Date) {
    if (this.birthday !== value) {
      this.changeTracker.recordOriginalValue('birthday', this._birthday);
      this._birthday = value;
      this.onPropertyChanged('birthday');
    }
  }

  // Change Tracker
  protected onPropertyChanged(propertyName: string) {
    if (this.changeTracker.state !== ObjectState.added && this.changeTracker.state !== ObjectState.deleted) {
      this.changeTracker.state = ObjectState.modified;
    }
  }

  public get changeTracker(): ObjectChangeTracker {
    if (!this._changeTracker) {
      this._changeTracker = new ObjectChangeTracker();
    }
    return this._changeTracker;
  }
  public set changeTracker(value: ObjectChangeTracker) {
    this._changeTracker = value;
  }
  // Change Tracker -- end
}
