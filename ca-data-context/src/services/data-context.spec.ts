import 'core-js';
import { DataContext } from './data-context';
import { Major, MajorCity, SSNCard, Person, Team, IdCard, BasketTeam } from './fixtures/models';
import { City } from './fixtures/models.2';

describe('DataContext', () => {

  let dataContext: DataContext;

  beforeEach(() => {
    // Arrange
    dataContext = new DataContext();
  });

  it('should be defined', () => {
    // Assert
    expect(DataContext).toBeDefined();
    expect(dataContext).toBeDefined();
    expect(dataContext instanceof DataContext).toBe(true);
  });

  it('should return another object if keys are not equal', () => {
    // Arrange
    let person1 = new Person('1', 'Valerio', 'Como', 'mail@email.it');
    let person2 = new Person('2', 'Valerio', 'Como', 'mail@email.it');
    // Act
    let expected = dataContext.attach(person1);
    let actual = dataContext.attach(person2);
    // Assert
    expect(actual).not.toBe(expected);
  });

  it('should return the same object if keys are equal', () => {
    // Arrange
    let person1 = new Person('1', 'Valerio', 'Como', 'mail@email.it');
    let person2 = new Person('1', 'Mario', 'Como', 'mail@email.it');
    // Act
    let expected = dataContext.attach(person1);
    let actual = dataContext.attach(person2);
    // Assert
    expect(actual).toBe(expected);
    expect(actual).toBe(person1);
    expect(actual.name).toBe('Mario');
  });

  // Test multiple keys
  it('should return another object if multiple keys are not equal', () => {
    // Arrange
    let team1 = new Team('team1', 'bari', 10);
    let team2 = new Team('team2', 'bari', 10);
    // Act
    let expected = dataContext.attach(team1);
    let actual = dataContext.attach(team2);
    // Assert
    expect(actual).not.toBe(expected);
  });

  it('should return the same object if multiple keys are equal', () => {
    // Arrange
    let team1 = new Team('team1', 'bari', 10);
    let team2 = new Team('team1', 'bari', 10);
    // Act
    let expected = dataContext.attach(team1);
    let actual = dataContext.attach(team2);
    // Assert
    expect(actual).toBe(expected);
  });

  // Test object key
  it('should return another object if keys with objects are not equal', () => {
    // Arrange
    let person1 = new Person('1', 'Valerio', 'Como', 'mail@email.it');
    let person2 = new Person('2', 'Valerio', 'Como', 'mail@email.it');

    let idCard1 = new IdCard('bari', person1);
    let idCard2 = new IdCard('bari', person2);
    // Act
    let expected = dataContext.attach(idCard1);
    let actual = dataContext.attach(idCard2);
    // Assert
    expect(actual).not.toBe(expected);
  });

  it('should return the same object if keys with objects are equal', () => {
    // Arrange
    let person1 = new Person('1', 'Valerio', 'Como', 'mail@email.it');
    let person2 = new Person('1', 'Valerio', 'Como', 'mail@email.it');

    let idCard1 = new IdCard('bari', person1);
    let idCard2 = new IdCard('bari', person2);
    // Act
    let expected = dataContext.attach(idCard1);
    let actual = dataContext.attach(idCard2);
    // Assert
    expect(actual).toBe(expected);
  });

  // Test object multi key
  it('should return another object if multi keys with objects are not equal (check object key)', () => {
    // Arrange
    let person1 = new Person('1', 'Valerio', 'Como', 'mail@email.it');
    let person2 = new Person('2', 'Valerio', 'Como', 'mail@email.it');

    let idCard1 = new SSNCard('bari', person1, 200);
    let idCard2 = new SSNCard('bari', person2, 200);
    // Act
    let expected = dataContext.attach(idCard1);
    let actual = dataContext.attach(idCard2);
    // Assert
    expect(actual).not.toBe(expected);
  });

  it('should return another object if multi keys with objects are not equal (check non-object key)', () => {
    // Arrange
    let person1 = new Person('1', 'Valerio', 'Como', 'mail@email.it');
    let person2 = new Person('1', 'Valerio', 'Como', 'mail@email.it');

    let idCard1 = new SSNCard('bari', person1, 201);
    let idCard2 = new SSNCard('bari', person2, 200);
    // Act
    let expected = dataContext.attach(idCard1);
    let actual = dataContext.attach(idCard2);
    // Assert
    expect(actual).not.toBe(expected);
  });

  it('should return another object if multi keys with objects are not equal (check object key and non-object key)', () => {
    // Arrange
    let person1 = new Person('1', 'Valerio', 'Como', 'mail@email.it');
    let person2 = new Person('2', 'Valerio', 'Como', 'mail@email.it');

    let idCard1 = new SSNCard('bari', person1, 201);
    let idCard2 = new SSNCard('bari', person2, 200);
    // Act
    let expected = dataContext.attach(idCard1);
    let actual = dataContext.attach(idCard2);
    // Assert
    expect(actual).not.toBe(expected);
  });

  it('should return the same object if multi keys with objects are equal', () => {
    // Arrange
    let person1 = new Person('1', 'Valerio', 'Como', 'mail@email.it');
    let person2 = new Person('1', 'Valerio', 'Como', 'mail@email.it');

    let idCard1 = new SSNCard('bari', person1, 200);
    let idCard2 = new SSNCard('bari', person2, 200);
    // Act
    let expected = dataContext.attach(idCard1);
    let actual = dataContext.attach(idCard2);
    // Assert
    expect(actual).toBe(expected);
  });

  // Test recursive e.g Person and Job
  it('should return another object if object properties are not equal', () => {
    // Arrange
    let coach = new Person('1', 'Valerio', 'Como', 'mail@email.it');
    let coachClone = new Person('2', 'Valerio', 'Como', 'mail@email.it');

    let basketTeam = new BasketTeam('bari', coachClone);
    // Act
    let expected = dataContext.attach(coach);
    let actual = dataContext.attach(basketTeam);
    // Assert
    expect(actual.coach).not.toBe(expected);
  });

  it('should return the same object if object properties are equal', () => {
    // Arrange
    let coach = new Person('1', 'Valerio', 'Como', 'mail@email.it');
    let coachClone = new Person('1', 'Mario', 'Rossi', 'mail@email.it');

    let basketTeam = new BasketTeam('bari', coachClone);
    // Act
    let expected = dataContext.attach(coach);
    let actual = dataContext.attach(basketTeam);
    // Assert
    expect(actual.coach).toBe(expected);
    expect(actual.coach).toBe(coach);
  });

  it('should refer to the same object if object properties are equal', () => {
    // Arrange
    let coach = new Person('1', 'Valerio', 'Como', 'mail@email.it');
    let coachClone = new Person('1', 'Mario', 'Rossi', 'mail@email.it');

    let basketTeam = new BasketTeam('bari', coachClone);
    // Act
    let expected = coach;
    dataContext.attach(coach);
    let actual = dataContext.attach(basketTeam);
    // Assert
    expect(actual.coach).toBe(expected);
  });

  it('should return the same values if object properties are equal', () => {
    // Arrange
    let coach = new Person('1', 'Mario', 'Rossi', 'mail@email.it');

    let basketTeam = new BasketTeam('bari', coach);
    // Act
    let expected = 'Mario';
    let actual = dataContext.attach(basketTeam);
    // Assert
    expect(actual.coach.name).toBe(expected);
  });

  // Test recursive e.g BasketTeam and list of Person
  it('should return another object if an array property is not equal', () => {
    // Arrange
    let coach1 = new Person('1', 'Valerio', 'Como', 'mail@email.it');
    let coach2 = new Person('2', 'Valerio', 'Como', 'mail@email.it');

    let playersList1 = [new Person('23', 'John', 'doe', 'email@mail.it')];
    let playersList2 = [new Person('32', 'John', 'doe', 'email@mail.it')];

    let basketTeam1 = new BasketTeam('bari1', coach1, playersList1);
    let basketTeam2 = new BasketTeam('bari2', coach2, playersList2);
    // Act
    let expected = dataContext.attach(basketTeam1);
    let actual = dataContext.attach(basketTeam2);
    // Assert
    expect(actual).not.toBe(expected);
  });

  it('should return another object if an array property is equal', () => {
    // Arrange
    let coach1 = new Person('1', 'Valerio', 'Como', 'mail@email.it');
    let coach2 = new Person('2', 'Valerio', 'Como', 'mail@email.it');

    let playersList = [new Person('23', 'John', 'doe', 'email@mail.it')];

    let basketTeam1 = new BasketTeam('bari1', coach1, playersList);
    let basketTeam2 = new BasketTeam('bari2', coach2, playersList);
    // Act
    let expected = dataContext.attach(basketTeam1);
    let actual = dataContext.attach(basketTeam2);
    // Assert
    expect(actual).not.toBe(expected);
  });

  // Test cyclic dependencies
  it('should return the same object with a cyclic dependency', () => {
    // Arrange
    let city = new City('cityId', 'cityname');
    let major = new Major('majorId', 'Quimby');

    major.city = city;
    city.major = major;
    // Act
    let expected = dataContext.attach(city);
    let actual = dataContext.attach(major);
    // Assert
    expect(actual.city).toBe(expected);
    expect(actual).toBe(expected.major);
  });

  it('should return the same object with a cyclic dependency from different objects', () => {
    // Arrange
    let city1 = new City('cityId1', 'Palese');
    let city2 = new City('cityId2', 'Zapponeta');
    let major1 = new Major('majorId', 'Quimby');
    let major2 = new Major('majorId', 'Francesco');

    major1.city = city1;
    city1.major = major1;
    major2.city = city2;
    city2.major = major2;
    // Act
    let expected = dataContext.attach(city1).major;
    let actual = dataContext.attach(city2).major;
    // Assert
    expect(actual).toBe(expected);
  });

  it('should return another object from an array', () => {
    // Arrange
    let coach1 = new Person('1', 'Valerio', 'Como', 'mail@email.it');
    let coach2 = new Person('2', 'Valerio', 'Como', 'mail@email.it');

    let playersList1 = [new Person('23', 'John', 'doe', 'email@mail.it')];
    let playersList2 = [new Person('33', 'John', 'doe', 'email@mail.it')];

    let basketTeam1 = new BasketTeam('bari1', coach1, playersList1);
    let basketTeam2 = new BasketTeam('bari2', coach2, playersList2);
    // Act
    let expected = dataContext.attach(basketTeam1).players[0];
    let actual = dataContext.attach(basketTeam2).players[0];
    // Assert
    expect(actual).not.toBe(expected);
  });

  it('should return the same object from an array', () => {
    // Arrange
    let coach1 = new Person('1', 'Valerio', 'Como', 'mail@email.it');
    let coach2 = new Person('2', 'Valerio', 'Como', 'mail@email.it');

    let playersList1 = [new Person('23', 'John', 'doe', 'email@mail.it')];
    let playersList2 = [new Person('23', 'John', 'doe', 'email@mail.it')];

    let basketTeam1 = new BasketTeam('bari1', coach1, playersList1);
    let basketTeam2 = new BasketTeam('bari2', coach2, playersList2);
    // Act
    let expected = dataContext.attach(basketTeam1).players[0];
    let actual = dataContext.attach(basketTeam2).players[0];
    // Assert
    expect(actual).toBe(expected);
  });

  // Test handling conflicts
  // Test detach
  it('should detach the object', () => {
    // Arrange
    let person1 = new Person('2', 'valerio', 'como', 'mail@email.it');
    let person2 = new Person('2', 'valerio', 'como', 'mail@email.it');
    // Act
    let expected = dataContext.attach(person1);
    dataContext.detach(expected);
    let actual = dataContext.attach(person2);
    // Assert
    expect(actual).not.toBe(expected);
  });

  it('should attach the properties', () => {
    // Arrange
    let person = new Person('2', 'valerio', 'como', 'mail@email.it');
    let city = new City('cityId', 'City Name');
    let plainObject = {
      person: new Person('2', 'valerio', 'como', 'mail@email.it'),
      city: new City('cityId', 'City Name')
    };
    // Act
    let attachedCity = dataContext.attach(city);
    let attachedPerson = dataContext.attach(person);
    let actual = dataContext.attach(plainObject);
    // Assert
    expect(actual.person).toBe(attachedPerson);
    expect(actual.city).toBe(attachedCity);
  });

  it('should not attach the strings', () => {
    // Arrange
    let array1 = ['string1', 'string2'];
    let array2 = ['string1', 'string2'];
    // Act
    let expected = dataContext.attach(array1);
    let actual = dataContext.attach(array2);
    // Assert
    expect(actual).not.toBe(expected);
    expect(actual[0]).toBe(expected[0]);
    expect(actual[1]).toBe(expected[1]);
  });

  it('should not attach array of strings', () => {
    // Arrange
    let array1 = { array: ['string1', 'string2'] };
    let array2 = { array: ['string1', 'string2'] };
    // Act
    let expected = dataContext.attach(array1);
    let actual = dataContext.attach(array2);
    // Assert
    expect(actual).not.toBe(expected);
    expect(actual.array[0]).toBe(expected.array[0]);
    expect(actual.array[1]).toBe(expected.array[1]);
  });

  it('should not attach the identical object without a clear on dataContext', () => {
    // Arrange
    let person1 = new Person('1', 'Valerio', 'Como', 'mail@email.it');
    let person2 = new Person('1', 'Valerio', 'Como', 'mail@email.it');
    // Act
    dataContext.clear();
    let expected = dataContext.attach(person1);
    let actual = dataContext.attach(person2);
    // Assert
    expect(actual).toBe(expected);
  });

  it('should attach the identical object after a clear on dataContext', () => {
    // Arrange
    let person1 = new Person('1', 'Valerio', 'Como', 'mail@email.it');
    let person2 = new Person('1', 'Valerio', 'Como', 'mail@email.it');
    // Act
    let expected = dataContext.attach(person1);
    dataContext.clear();
    let actual = dataContext.attach(person2);
    // Assert
    expect(actual).not.toBe(expected);
  });

  it('should not attach object if key is undefined', () => {
    // Arrange
    let person1 = new Person(undefined, 'Valerio', 'Como', 'mail@email.it');
    let person2 = new Person(undefined, 'Valerio', 'Como', 'mail@email.it');
    // Act
    let expected = dataContext.attach(person1);
    let actual = dataContext.attach(person2);
    // Assert
    expect(actual).not.toBe(expected);
  });

  it('should not attach object if key is null', () => {
    // Arrange
    let person1 = new Person(null, 'Valerio', 'Como', 'mail@email.it');
    let person2 = new Person(null, 'Valerio', 'Como', 'mail@email.it');
    // Act
    let expected = dataContext.attach(person1);
    let actual = dataContext.attach(person2);
    // Assert
    expect(actual).not.toBe(expected);
  });

  it('should not attach object if key is empty string', () => {
    // Arrange
    let person1 = new Person('', 'Valerio', 'Como', 'mail@email.it');
    let person2 = new Person('', 'Valerio', 'Como', 'mail@email.it');
    // Act
    let expected = dataContext.attach(person1);
    let actual = dataContext.attach(person2);
    // Assert
    expect(actual).not.toBe(expected);
  });

  it('should not attach object if key is NaN', () => {
    // Arrange
    let person1 = new Person(NaN, 'Valerio', 'Como', 'mail@email.it');
    let person2 = new Person(NaN, 'Valerio', 'Como', 'mail@email.it');
    // Act
    let expected = dataContext.attach(person1);
    let actual = dataContext.attach(person2);
    // Assert
    expect(actual).not.toBe(expected);
  });

  // value object
  it('should not attach a value object', () => {
    // Arrange
    let city1 = new City('cityId', 'Santeramo');
    let major1 = new Major('majorId', 'Sindaco');
    let city2 = new City('cityId', 'Santeramo');
    let major2 = new Major('majorId', 'Sindaco');
    let majorCity1 = new MajorCity(major1, city1);
    let majorCity2 = new MajorCity(major2, city2);
    // Act
    let expected = dataContext.attach(majorCity1);
    let actual = dataContext.attach(majorCity2);
    // Assert
    expect(actual).not.toBe(expected);
    expect(actual.city).toBe(expected.city);
    expect(actual.major).toBe(expected.major);
  });
});
