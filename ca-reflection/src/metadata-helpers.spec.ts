import 'core-js';
import { MetadataHelpers } from './metadata-helpers';
import { expect } from 'chai';

const DecoratorKey = 'decorator';

function Decorator(...params: Array<string>) { // this is the decorator factory
  return MetadataHelpers.defineMetadata(DecoratorKey, params);
}

@Decorator('Class Meta')
class Entity {

  @Decorator('Field Meta')
  private field: string;

  @Decorator('Static Method Meta')
  public static staticMethod() {
    throw 'No yet implemented';
  }

  constructor(args: any) {
    this.field = args.field;
  }

  @Decorator('Property Meta')
  public get property() { return this.field; }
  public set property(value: string) { this.field = value; }

  @Decorator('Method Meta')
  public method() {
    throw 'No yet implemented';
  }
}

class ChildEntity extends Entity { }

describe('Metadata helpers', () => {
  describe('Base class', () => {
    it('should extract class metadata from class', () => {
      // Act
      let metadata = MetadataHelpers.getMetadata(DecoratorKey, Entity, undefined, { inheritParentMetadata: true });

      // Assert
      expect(metadata).to.exist;
      expect(metadata).to.deep.equal(['Class Meta']);
    });

    it('should extract class metadata from instance', () => {
      // Arrange
      let entity = new Entity({ field: 'field' });

      // Act
      let metadata = MetadataHelpers.getMetadata(DecoratorKey, entity, undefined, { inheritParentMetadata: true });

      // Assert
      expect(metadata).to.exist;
      expect(metadata).to.deep.equal(['Class Meta']);
    });

    it('should return undefined if pass undefined target', () => {
      // Act
      let metadata = MetadataHelpers.getMetadata(DecoratorKey, undefined);

      // Assert
      expect(metadata).to.not.exist;

    });

    it('should return undefined if pass null target', () => {
      // Act
      let metadata = MetadataHelpers.getMetadata(DecoratorKey, null);

      // Assert
      expect(metadata).to.not.exist;

    });

    it('should extract field metadata from class', () => {
      // Act
      let metadata = MetadataHelpers.getMetadata(DecoratorKey, Entity, 'field', { inheritParentMetadata: true });

      // Assert
      expect(metadata).to.exist;
      expect(metadata).to.deep.equal(['Field Meta']);
    });

    it('should extract field metadata from instance', () => {
      // Arrange
      let entity = new Entity({ field: 'field' });

      // Act
      let metadata = MetadataHelpers.getMetadata(DecoratorKey, entity, 'field', { inheritParentMetadata: true });

      // Assert
      expect(metadata).to.exist;
      expect(metadata).to.deep.equal(['Field Meta']);
    });

    it('should extract property metadata from class', () => {
      // Act
      let metadata = MetadataHelpers.getMetadata(DecoratorKey, Entity, 'property', { inheritParentMetadata: true });

      // Assert
      expect(metadata).to.exist;
      expect(metadata).to.deep.equal(['Property Meta']);
    });

    it('should extract property metadata from instance', () => {
      // Arrange
      let entity = new Entity({ field: 'field' });

      // Act
      let metadata = MetadataHelpers.getMetadata(DecoratorKey, entity, 'property', { inheritParentMetadata: true });

      // Assert
      expect(metadata).to.exist;
      expect(metadata).to.deep.equal(['Property Meta']);
    });

    it('should extract method metadata from class', () => {
      // Act
      let metadata = MetadataHelpers.getMetadata(DecoratorKey, Entity, 'method', { inheritParentMetadata: true });

      // Assert
      expect(metadata).to.exist;
      expect(metadata).to.deep.equal(['Method Meta']);
    });

    it('should extract method metadata from instance', () => {
      // Arrange
      let entity = new Entity({ field: 'field' });

      // Act
      let metadata = MetadataHelpers.getMetadata(DecoratorKey, entity, 'method', { inheritParentMetadata: true });

      // Assert
      expect(metadata).to.exist;
      expect(metadata).to.deep.equal(['Method Meta']);
    });

    it('should extract static method metadata from class', () => {
      // Act
      let metadata = MetadataHelpers.getMetadata(DecoratorKey, Entity, 'staticMethod', { inheritParentMetadata: true });

      // Assert
      expect(metadata).to.exist;
      expect(metadata).to.deep.equal(['Static Method Meta']);
    });

    it('should extract static method metadata from instance', () => {
      // Arrange
      let entity = new Entity({ field: 'field' });

      // Act
      let metadata = MetadataHelpers.getMetadata(DecoratorKey, entity, 'staticMethod', { inheritParentMetadata: true });

      // Assert
      expect(metadata).to.exist;
      expect(metadata).to.deep.equal(['Static Method Meta']);
    });
  });

  describe('Derived class', () => {
    it('should extract class metadata from derived class', () => {
      // Act
      let metadata = MetadataHelpers.getMetadata(DecoratorKey, ChildEntity, undefined, { inheritParentMetadata: true });

      // Assert
      expect(metadata).to.exist;
      expect(metadata).to.deep.equal(['Class Meta']);
    });

    it('should extract class metadata from derived instance', () => {
      // Arrange
      let childEntity = new ChildEntity({ field: 'field' });

      // Act
      let metadata = MetadataHelpers.getMetadata(DecoratorKey, childEntity, undefined, { inheritParentMetadata: true });

      // Assert
      expect(metadata).to.exist;
      expect(metadata).to.deep.equal(['Class Meta']);
    });

    it('should extract field metadata from derived class', () => {
      // Act
      let metadata = MetadataHelpers.getMetadata(DecoratorKey, ChildEntity, 'field', { inheritParentMetadata: true });

      // Assert
      expect(metadata).to.exist;
      expect(metadata).to.deep.equal(['Field Meta']);
    });

    it('should extract field metadata from derived instance', () => {
      // Arrange
      let childEntity = new ChildEntity({ field: 'field' });

      // Act
      let metadata = MetadataHelpers.getMetadata(DecoratorKey, childEntity, 'field', { inheritParentMetadata: true });

      // Assert
      expect(metadata).to.exist;
      expect(metadata).to.deep.equal(['Field Meta']);
    });

    it('should extract property metadata from derived class', () => {
      // Act
      let metadata = MetadataHelpers.getMetadata(DecoratorKey, ChildEntity, 'property', { inheritParentMetadata: true });

      // Assert
      expect(metadata).to.exist;
      expect(metadata).to.deep.equal(['Property Meta']);
    });

    it('should extract property metadata from derived instance', () => {
      // Arrange
      let childEntity = new ChildEntity({ field: 'field' });

      // Act
      let metadata = MetadataHelpers.getMetadata(DecoratorKey, childEntity, 'property', { inheritParentMetadata: true });

      // Assert
      expect(metadata).to.exist;
      expect(metadata).to.deep.equal(['Property Meta']);
    });

    it('should extract method metadata from derived class', () => {
      // Act
      let metadata = MetadataHelpers.getMetadata(DecoratorKey, ChildEntity, 'method', { inheritParentMetadata: true });

      // Assert
      expect(metadata).to.exist;
      expect(metadata).to.deep.equal(['Method Meta']);
    });

    it('should extract method metadata from derived instance', () => {
      // Arrange
      let childEntity = new ChildEntity({ field: 'field' });

      // Act
      let metadata = MetadataHelpers.getMetadata(DecoratorKey, childEntity, 'method', { inheritParentMetadata: true });

      // Assert
      expect(metadata).to.exist;
      expect(metadata).to.deep.equal(['Method Meta']);
    });

    it('should extract static method metadata from derived class', () => {
      // Act
      let metadata = MetadataHelpers.getMetadata(DecoratorKey, ChildEntity, 'staticMethod', { inheritParentMetadata: true });

      // Assert
      expect(metadata).to.exist;
      expect(metadata).to.deep.equal(['Static Method Meta']);
    });

    it('should extract static method metadata from derived instance', () => {
      // Arrange
      let childEntity = new ChildEntity({ field: 'field' });

      // Act
      let metadata = MetadataHelpers.getMetadata(DecoratorKey, childEntity, 'staticMethod', { inheritParentMetadata: true });

      // Assert
      expect(metadata).to.exist;
      expect(metadata).to.deep.equal(['Static Method Meta']);
    });
  });
});
