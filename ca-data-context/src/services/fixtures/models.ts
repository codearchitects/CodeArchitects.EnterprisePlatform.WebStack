import { Entity } from '../../decorators';

@Entity({
  name: 'myPerson',
  keys: 'key'
})
export class Person {
  constructor(
    public key: any,
    public name: string,
    public surname: string,
    public email: string,
    public birthDate?: Date
  ) { }
}

@Entity({
  name: 'myTeam',
  keys: ['name', 'city']
})
export class Team {
  constructor(
    public name: string,
    public city: string,
    public players: number
  ) { }
}

@Entity({
  name: 'myIdcard',
  keys: 'person'
})
export class IdCard {

  constructor(
    public city: string,
    public person: Person
  ) { }
}

@Entity({
  name: 'mySSNcard',
  keys: ['person', 'code']
})
export class SSNCard {

  constructor(
    public city: string,
    public person: Person,
    public code: number
  ) { }
}

@Entity({
  name: 'myBasketTeam',
  keys: 'name'
})
export class BasketTeam {
  constructor(
    public name: string,
    public coach: Person,
    public players = new Array<Person>()
  ) { }
}

@Entity({
  name: 'myCity',
  keys: 'id'
})
export class City {
  constructor(
    public id: string,
    public name: string,
    public major?: Major
  ) { }
}

@Entity({
  name: 'myMajor',
  keys: 'id'
})
export class Major {
  constructor(
    public id: string,
    public name: string,
    public city?: City,
    public partner?: Person
  ) { }
}
//Value Object
export class MajorCity {
  constructor(
    public major: Major,
    public city: City
  ) {}
}
