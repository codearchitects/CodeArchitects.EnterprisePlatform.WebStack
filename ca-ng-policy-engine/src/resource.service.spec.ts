import { TestBed, inject } from '@angular/core/testing';
import { ResourceService } from './resource.service';
import { Resource } from './resource.decorator';

export function main() {
  describe('ResourceService', () => {
    let sut: ResourceService;
    let person: Person;

    beforeEach(() => {
      TestBed.configureTestingModule({ providers: [ResourceService] });
    });

    beforeEach(inject([ResourceService], (resourceService: ResourceService) => {
      sut = resourceService;
    }));

    beforeEach(() => {
      person = new Person();
    });

    it('should return model resource params from class', () => {
      // Act
      const actual = sut.getResource(Person);
      const expected = { uri: 'model://person' };

      // Assert
      expect(actual).toEqual(expected);
    });

    it('should return model resource params from instance', () => {
      // Act
      const actual = sut.getResource(person);
      const expected = { uri: 'model://person' };

      // Assert
      expect(actual).toEqual(expected);
    });

    it('should return property resource params from class', () => {
      // Act
      const actual = sut.getResource(Person, 'firstName');
      const expected = { uri: 'property://person/first-name' };

      // Assert
      expect(actual).toEqual(expected);
    });

    it('should return property resource params from instance', () => {
      // Act
      const actual = sut.getResource(person, 'firstName');
      const expected = { uri: 'property://person/first-name' };

      // Assert
      expect(actual).toEqual(expected);
    });

  });
}

@Resource({
  uri: 'model://person'
})
class Person {
  private _firstName: string;

  @Resource({
    uri: 'property://person/first-name'
  })
  public get firstName() { return this._firstName; }
  public set firstName(value: string) { this._firstName = value; }
}

main();
