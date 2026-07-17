import 'core-js';
import { DataContext } from './data-context';
import { expect } from 'chai';
import { City, Major, MajorCity, SSNCard, Person, Team, IdCard, BasketTeam } from './fixtures/models';

describe('DataContext', () => {

  beforeEach(() => {
    // Arrange
    this.dataContext = new DataContext();
  });

  it('should be defined', () => {
    // Assert
    expect(DataContext).to.exist;
    expect(this.dataContext).to.exist;
    expect(this.dataContext instanceof DataContext).to.be.true;
  });

  it('should return another object if keys are not equal', () => {
    //Arrange
    let person1 = new Person('1', 'Valerio', 'Como', 'mail@email.it');
    let person2 = new Person('2', 'Valerio', 'Como', 'mail@email.it');
    //Act
    let expected = (<DataContext>this.dataContext).attach(person1);
    let actual = (<DataContext>this.dataContext).attach(person2);
    //Assert
    expect(actual).not.to.be.equal(expected);
  });

  it('should return the same object if keys are equal', () => {
    //Arrange
    let person1 = new Person('1', 'Valerio', 'Como', 'mail@email.it');
    let person2 = new Person('1', 'Mario', 'Como', 'mail@email.it');
    //Act
    let expected = (<DataContext>this.dataContext).attach(person1);
    let actual = (<DataContext>this.dataContext).attach(person2);
    //Assert
    expect(actual).to.be.equal(expected);
    expect(actual).to.be.equal(person1);
    expect(actual.name).to.be.equal('Mario');
    //Scorporare in due test
  });

  // Test multiple keys
  it('should return another object if multiple keys are not equals', () => {
    //Arrange
    let team1 = new Team('team1', 'bari', 10);
    let team2 = new Team('team2', 'bari', 10);
    //Act
    let expected = (<DataContext>this.dataContext).attach(team1);
    let actual = (<DataContext>this.dataContext).attach(team2);
    //Assert
    expect(actual).not.to.be.equal(expected);
  });

  it('should return the same object if multiple keys are equals', () => {
    //Arrange
    let team1 = new Team('team1', 'bari', 10);
    let team2 = new Team('team1', 'bari', 10);
    //Act
    let expected = (<DataContext>this.dataContext).attach(team1);
    let actual = (<DataContext>this.dataContext).attach(team2);
    //Assert
    expect(actual).to.be.equal(expected);
  });

  // Test object key
  it('should return another object if keys with objects are not equals', () => {
    //Arrange
    let person1 = new Person('1', 'Valerio', 'Como', 'mail@email.it');
    let person2 = new Person('2', 'Valerio', 'Como', 'mail@email.it');

    let idCard1 = new IdCard('bari', person1);
    let idCard2 = new IdCard('bari', person2);
    //Act
    let expected = (<DataContext>this.dataContext).attach(idCard1);
    let actual = (<DataContext>this.dataContext).attach(idCard2);
    //Assert
    expect(actual).not.to.be.equal(expected);
  });

  it('should return the same object if keys with objects are equals', () => {
    //Arrange
    let person1 = new Person('1', 'Valerio', 'Como', 'mail@email.it');
    let person2 = new Person('1', 'Valerio', 'Como', 'mail@email.it');

    let idCard1 = new IdCard('bari', person1);
    let idCard2 = new IdCard('bari', person2);
    //Act
    let expected = (<DataContext>this.dataContext).attach(idCard1);
    let actual = (<DataContext>this.dataContext).attach(idCard2);
    //Assert
    expect(actual).to.be.equal(expected);
  });

  // Test object multi key
  it('should return another object if multi keys with objects are not equals (check object key)', () => {
    //Arrange
    let person1 = new Person('1', 'Valerio', 'Como', 'mail@email.it');
    let person2 = new Person('2', 'Valerio', 'Como', 'mail@email.it');

    let idCard1 = new SSNCard('bari', person1, 200);
    let idCard2 = new SSNCard('bari', person2, 200);
    //Act
    let expected = (<DataContext>this.dataContext).attach(idCard1);
    let actual = (<DataContext>this.dataContext).attach(idCard2);
    //Assert
    expect(actual).not.to.be.equal(expected);
  });

  it('should return another object if multi keys with objects are not equals (check non-object key)', () => {
    //Arrange
    let person1 = new Person('1', 'Valerio', 'Como', 'mail@email.it');
    let person2 = new Person('1', 'Valerio', 'Como', 'mail@email.it');

    let idCard1 = new SSNCard('bari', person1, 201);
    let idCard2 = new SSNCard('bari', person2, 200);
    //Act
    let expected = (<DataContext>this.dataContext).attach(idCard1);
    let actual = (<DataContext>this.dataContext).attach(idCard2);
    //Assert
    expect(actual).not.to.be.equal(expected);
  });

  it('should return another object if multi keys with objects are not equals (check object key and non-object key)', () => {
    //Arrange
    let person1 = new Person('1', 'Valerio', 'Como', 'mail@email.it');
    let person2 = new Person('2', 'Valerio', 'Como', 'mail@email.it');

    let idCard1 = new SSNCard('bari', person1, 201);
    let idCard2 = new SSNCard('bari', person2, 200);
    //Act
    let expected = (<DataContext>this.dataContext).attach(idCard1);
    let actual = (<DataContext>this.dataContext).attach(idCard2);
    //Assert
    expect(actual).not.to.be.equal(expected);
  });

  it('should return the same object if multi keys with objects are equals', () => {
    //Arrange
    let person1 = new Person('1', 'Valerio', 'Como', 'mail@email.it');
    let person2 = new Person('1', 'Valerio', 'Como', 'mail@email.it');

    let idCard1 = new SSNCard('bari', person1, 200);
    let idCard2 = new SSNCard('bari', person2, 200);
    //Act
    let expected = (<DataContext>this.dataContext).attach(idCard1);
    let actual = (<DataContext>this.dataContext).attach(idCard2);
    //Assert
    expect(actual).to.be.equal(expected);
  });

  // Test ricorsivo e.g Person and Job
  it('should return another object if object properties are not equals', () => {
    //Arrange
    let coach = new Person('1', 'Valerio', 'Como', 'mail@email.it');
    let coachClone = new Person('2', 'Valerio', 'Como', 'mail@email.it');

    let basketTeam = new BasketTeam('bari', coachClone);
    //Act
    let expected = (<DataContext>this.dataContext).attach(coach);
    let actual = (<DataContext>this.dataContext).attach(basketTeam);
    //Assert
    expect(actual.coach).not.to.be.equal(expected);
  });

  it('should return the same object if object properties are equals', () => {
    //Arrange
    let coach = new Person('1', 'Valerio', 'Como', 'mail@email.it');
    let coachClone = new Person('1', 'Mario', 'Rossi', 'mail@email.it');

    let basketTeam = new BasketTeam('bari', coachClone);
    //Act
    let expected = (<DataContext>this.dataContext).attach(coach);
    let actual = (<DataContext>this.dataContext).attach(basketTeam);
    //Assert
    expect(actual.coach).to.be.equal(expected);
    //ToBeExported
    expect(actual.coach).to.be.equal(coach);
  });

  it('should return refers to the same object if object properties are equals', () => {
    //Arrange
    let coach = new Person('1', 'Valerio', 'Como', 'mail@email.it');
    let coachClone = new Person('1', 'Mario', 'Rossi', 'mail@email.it');

    let basketTeam = new BasketTeam('bari', coachClone);
    //Act
    let expected = coach;
    (<DataContext>this.dataContext).attach(coach);
    let actual = (<DataContext>this.dataContext).attach(basketTeam);
    //Assert
    expect(actual.coach).to.be.equal(expected);
  });

  it('should return the same values if object properties are equals', () => {
    //Arrange
    let coach = new Person('1', 'Mario', 'Rossi', 'mail@email.it');

    let basketTeam = new BasketTeam('bari', coach);
    //Act
    let expected = 'Mario';
    let actual = (<DataContext>this.dataContext).attach(basketTeam);
    //Assert
    expect(actual.coach.name).to.be.equal(expected);
  });

  // Test ricorsivo e.g BasketTeam and list of Person
  it('should return another object if an array property are not equals', () => {
    //Arrange
    let coach1 = new Person('1', 'Valerio', 'Como', 'mail@email.it');
    let coach2 = new Person('2', 'Valerio', 'Como', 'mail@email.it');

    let playersList1 = new Array<Person>();
    let playersList2 = new Array<Person>();

    playersList1.push(new Person('23', 'John', 'doe', 'email@mail.it'));
    playersList2.push(new Person('32', 'John', 'doe', 'email@mail.it'));

    let basketTeam1 = new BasketTeam('bari1', coach1, playersList1);
    let basketTeam2 = new BasketTeam('bari2', coach2, playersList2);
    //Act
    let expected = (<DataContext>this.dataContext).attach(basketTeam1);
    let actual = (<DataContext>this.dataContext).attach(basketTeam2);
    //Assert
    expect(actual).not.to.be.equal(expected);
  });

  it('should return another object if an array property are equals', () => {
    //Arrange
    let coach1 = new Person('1', 'Valerio', 'Como', 'mail@email.it');
    let coach2 = new Person('2', 'Valerio', 'Como', 'mail@email.it');

    let playersList = new Array<Person>();

    playersList.push(new Person('23', 'John', 'doe', 'email@mail.it'));

    let basketTeam1 = new BasketTeam('bari1', coach1, playersList);
    let basketTeam2 = new BasketTeam('bari2', coach2, playersList);
    //Act
    let expected = (<DataContext>this.dataContext).attach(basketTeam1);
    let actual = (<DataContext>this.dataContext).attach(basketTeam2);
    //Assert
    expect(actual).not.to.be.equal(expected);
  });

  // Test dip cicliche
  it('should return the same object with a cyclic dependency', () => {
    //Arrange
    let city = new City('cityId', 'cityname');
    let major = new Major('majorId', 'Quimby');

    major.city = city;
    city.major = major;
    //Act
    let expected = (<DataContext>this.dataContext).attach(city);
    let actual = (<DataContext>this.dataContext).attach(major);
    //Assert
    expect(actual.city).to.be.equal(expected);
    expect(actual).to.be.equal(expected.major);
    // da gestire con le strategie di merge in un altro test
    // expect(actual.getPartner().getKey()).to.be.equal('mariaId');
  });

  it('should return the same object with a cyclic dependency from different objects', () => {
    //Arrange
    let city1 = new City('cityId1', 'Palese');
    let city2 = new City('cityId2', 'Zapponeta');
    let major1 = new Major('majorId', 'Quimby');
    let major2 = new Major('majorId', 'Francesco');

    major1.city = city1;
    city1.major = major1;
    major2.city = city2;
    city2.major = major2;
    //Act
    let expected = (<DataContext>this.dataContext).attach(city1).major;
    let actual = (<DataContext>this.dataContext).attach(city2).major;
    //Assert
    expect(actual).to.be.equal(expected);
  });

  it('should return another object from an array', () => {
    //Arrange
    let coach1 = new Person('1', 'Valerio', 'Como', 'mail@email.it');
    let coach2 = new Person('2', 'Valerio', 'Como', 'mail@email.it');

    let playersList1 = new Array<Person>();
    let playersList2 = new Array<Person>();

    playersList1.push(new Person('23', 'John', 'doe', 'email@mail.it'));
    playersList2.push(new Person('33', 'John', 'doe', 'email@mail.it'));

    let basketTeam1 = new BasketTeam('bari1', coach1, playersList1);
    let basketTeam2 = new BasketTeam('bari2', coach2, playersList2);
    //Act
    let expected = (<DataContext>this.dataContext).attach(basketTeam1).players[0];
    let actual = (<DataContext>this.dataContext).attach(basketTeam2).players[0];
    //Assert
    expect(actual).not.to.be.equal(expected);
  });

  it('should return the same object from an array', () => {
    //Arrange
    let coach1 = new Person('1', 'Valerio', 'Como', 'mail@email.it');
    let coach2 = new Person('2', 'Valerio', 'Como', 'mail@email.it');

    let playersList1 = new Array<Person>();
    let playersList2 = new Array<Person>();

    playersList1.push(new Person('23', 'John', 'doe', 'email@mail.it'));
    playersList2.push(new Person('23', 'John', 'doe', 'email@mail.it'));

    let basketTeam1 = new BasketTeam('bari1', coach1, playersList1);
    let basketTeam2 = new BasketTeam('bari2', coach2, playersList2);
    //Act
    let expected = (<DataContext>this.dataContext).attach(basketTeam1).players[0];
    let actual = (<DataContext>this.dataContext).attach(basketTeam2).players[0];
    //Assert
    expect(actual).to.be.equal(expected);
  });

  // Test gestione dei conflitti
  // Test detach
  it('should detach the object', () => {
    //Arrange
    let person1 = new Person('2', 'valerio', 'como', 'mail@email.it');
    let person2 = new Person('2', 'valerio', 'como', 'mail@email.it');
    //Act
    let expected = (<DataContext>this.dataContext).attach(person1);
    (<DataContext>this.dataContext).detach(expected);
    let actual = (<DataContext>this.dataContext).attach(person2);
    //Assert
    expect(actual).not.be.equal(expected);
  });

  it('should attach the properties', () => {
    //Arrange
    let person = new Person('2', 'valerio', 'como', 'mail@email.it');
    let city = new City('cityId', 'City Name');
    let plainObject = {
      person: new Person('2', 'valerio', 'como', 'mail@email.it'),
      city: new City('cityId', 'City Name')
    };
    //Act
    let attachedCity = (<DataContext>this.dataContext).attach(city);
    let attachedPerson = (<DataContext>this.dataContext).attach(person);
    let actual = (<DataContext>this.dataContext).attach(plainObject);
    //Assert
    expect(actual.person).to.be.equal(attachedPerson);
    expect(actual.city).to.be.equal(attachedCity);
  });

  it('should not attach the strings', () => {
    //Arrange
    let array1 = ['string1', 'string2'];
    let array2 = ['string1', 'string2'];
    //Act
    let expected = (<DataContext>this.dataContext).attach(array1);
    let actual = (<DataContext>this.dataContext).attach(array2);
    //Assert
    expect(actual).not.to.be.equal(expected);
    expect(actual[0]).to.be.equal(expected[0]);
    expect(actual[1]).to.be.equal(expected[1]);
  });

  it('should not attach array of strings', () => {
    //Arrange
    let array1 = { array: ['string1', 'string2'] };
    let array2 = { array: ['string1', 'string2'] };
    //Act
    let expected = (<DataContext>this.dataContext).attach(array1);
    let actual = (<DataContext>this.dataContext).attach(array2);
    //Assert
    expect(actual).not.to.be.equal(expected);
    expect(actual[0]).to.be.equal(expected[0]);
    expect(actual[1]).to.be.equal(expected[1]);
  });

  it('should not attach the identical object without a clear on dataContext', () => {
    //Arrange
    let person1 = new Person('1', 'Valerio', 'Como', 'mail@email.it');
    let person2 = new Person('1', 'Valerio', 'Como', 'mail@email.it');
    //Act
    (<DataContext>this.dataContext).clear();
    let expected = (<DataContext>this.dataContext).attach(person1);
    let actual = (<DataContext>this.dataContext).attach(person2);
    //Assert
    expect(actual).to.be.equal(expected);
  });

  it('should attach the identical object after a clear on dataContext', () => {
    //Arrange
    let person1 = new Person('1', 'Valerio', 'Como', 'mail@email.it');
    let person2 = new Person('1', 'Valerio', 'Como', 'mail@email.it');
    //Act
    let expected = (<DataContext>this.dataContext).attach(person1);
    (<DataContext>this.dataContext).clear();
    let actual = (<DataContext>this.dataContext).attach(person2);
    //Assert
    expect(actual).not.to.be.equal(expected);
  });

  it('should not attach object if key is undefined', () => {
    //Arrange
    let person1 = new Person(undefined, 'Valerio', 'Como', 'mail@email.it');
    let person2 = new Person(undefined, 'Valerio', 'Como', 'mail@email.it');
    //Act
    let expected = (<DataContext>this.dataContext).attach(person1);
    let actual = (<DataContext>this.dataContext).attach(person2);
    //Assert
    expect(actual).not.to.be.equal(expected);
  });

  it('should not attach object if key is null', () => {
    //Arrange
    let person1 = new Person(null, 'Valerio', 'Como', 'mail@email.it');
    let person2 = new Person(null, 'Valerio', 'Como', 'mail@email.it');
    //Act
    let expected = (<DataContext>this.dataContext).attach(person1);
    let actual = (<DataContext>this.dataContext).attach(person2);
    //Assert
    expect(actual).not.to.be.equal(expected);
  });

  it('should not attach object if key is empty string', () => {
    //Arrange
    let person1 = new Person('', 'Valerio', 'Como', 'mail@email.it');
    let person2 = new Person('', 'Valerio', 'Como', 'mail@email.it');
    //Act
    let expected = (<DataContext>this.dataContext).attach(person1);
    let actual = (<DataContext>this.dataContext).attach(person2);
    //Assert
    expect(actual).not.to.be.equal(expected);
  });

  it('should not attach object if key is NaN', () => {
    //Arrange
    let person1 = new Person(NaN, 'Valerio', 'Como', 'mail@email.it');
    let person2 = new Person(NaN, 'Valerio', 'Como', 'mail@email.it');
    //Act
    let expected = (<DataContext>this.dataContext).attach(person1);
    let actual = (<DataContext>this.dataContext).attach(person2);
    //Assert
    expect(actual).not.to.be.equal(expected);
  });

  //value object
  it('should not attach a value object', () => {
    //Arrange
    let city1 = new City('cityId', 'Santeramo');
    let major1 = new Major('majorId', 'Sindaco');
    let city2 = new City('cityId', 'Santeramo');
    let major2 = new Major('majorId', 'Sindaco');
    let majorCity1 = new MajorCity(major1, city1);
    let majorCity2 = new MajorCity(major2, city2);
    //Act
    let expected = (<DataContext>this.dataContext).attach(majorCity1);
    let actual = (<DataContext>this.dataContext).attach(majorCity2);
    //Assert
    expect(actual).not.to.be.equal(expected);
    expect(actual.city).to.be.equal(expected.city);
    expect(actual.major).to.be.equal(expected.major);
  });
});
