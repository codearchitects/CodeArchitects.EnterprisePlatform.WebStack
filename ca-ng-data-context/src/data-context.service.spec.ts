// import { TestBed, inject } from '@angular/core/testing';
// import { Entity } from 'ca-data-context/core';
// import { DataContextService } from './data-context.service';

describe('DataContextService tests', () => {
  it('should work', () => {});
});

// export function main() {
//   describe('DataContextService', () => {
//     let sut: DataContextService;

//     beforeEach(() => {
//       TestBed.configureTestingModule({ providers: [DataContextService] });
//     });

//     beforeEach(inject([DataContextService], (dataContextService: DataContextService) => {
//       sut = dataContextService;
//     }));

//     it('should attach an object', () => {
//       // Arrange
//       let person1 = new Person();
//       person1.id = 1;
//       person1.name = 'Nicola';
//       sut.attach(person1);

//       let person2 = new Person();
//       person2.id = 1;
//       person2.name = 'Giulia';

//       // Act
//       let actual = sut.attach(person2);

//       // Assert
//       expect(actual).toBe(person1);
//     });

//     it('should detach an object', () => {
//       // Arrange
//       let person1 = new Person();
//       person1.id = 1;
//       person1.name = 'Nicola';
//       sut.attach(person1);

//       let person2 = new Person();
//       person2.id = 1;
//       person2.name = 'Giulia';

//       // Act
//       sut.detach(person1);
//       let actual = sut.attach(person2);

//       // Assert
//       expect(actual).not.toBe(person1);
//     });

//   });

// }

// @Entity({
//   name: 'Fixture.Person',
//   keys: ['id']
// })
// class Person {

//   id: number;
//   name: string;

// }
