// TODO: =NS= restore tests when ca-ng-boilerplate supports them
// import { TestBed, inject } from '@angular/core/testing';
// import { SerializerService } from './serializer.service';
// import { JsonObject } from 'ca-reflection/core';

describe('SerializerService tests', () => {
  it('should work', () => {});
});

// export function main() {
//   describe('SerializerService', () => {
//     let sut: SerializerService;

//     beforeEach(() => {
//       TestBed.configureTestingModule({ providers: [SerializerService] });
//     });

//     beforeEach(inject([SerializerService], (serializerService: SerializerService) => {
//       sut = serializerService;
//     }));

//     it('should serialize an object', () => {
//       // Arrange
//       let fixture = new Person();
//       fixture.id = 1;
//       fixture.name = 'Nicola';

//       // Act
//       let actual = sut.serialize(fixture);
//       let expected = '{\'$type\':\'Fixture.Person\',\'$id\':\'1\',\'id\':1,\'name\':\'Nicola\'}';

//       // Assert
//       expect(actual).toEqual(expected);
//     });

//     it('should deserialize an object', () => {
//       // Arrange
//       let fixture = '{\'$type\':\'Fixture.Person\',\'$id\':\'1\',\'id\':1,\'name\':\'Nicola\'}';

//       // Act
//       let actual = sut.deserialize(fixture);
//       let expected = new Person();
//       expected.id = 1;
//       expected.name = 'Nicola';

//       // Assert
//       expect(actual).toEqual(expected);
//     });

//   });

// }

// @JsonObject({ name: 'Fixture.Person' })
// class Person {

//   id: number;
//   name: string;

// }
