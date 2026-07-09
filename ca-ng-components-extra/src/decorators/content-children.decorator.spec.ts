import { QueryList } from '@angular/core';
import { CaepContentChildren, CaepContentChildrenKey, ICaepContentChildrenMapping } from './content-children.decorator';

class FirstDummyClass {}

class SecondDummyClass {}

class ThirdDummyClass {}

class DummyComponent {
  @CaepContentChildren(FirstDummyClass)
  public firstDummyRefs: QueryList<FirstDummyClass>;

  @CaepContentChildren(SecondDummyClass, { descendants: true })
  public secondDummyRefs: QueryList<SecondDummyClass>;
}

class DummyChildComponent extends DummyComponent {
  @CaepContentChildren(ThirdDummyClass)
  public thirdDummyRefs: QueryList<ThirdDummyClass>;

  constructor() {
    super();
  }
}

describe('CaepContentChildren decorator', () => {
  let dummyInstance: DummyChildComponent;

  beforeEach(() => {
    dummyInstance = new DummyChildComponent();
  });

  it('should return a function', () => {
    const actualValue = CaepContentChildren(FirstDummyClass);
    expect(actualValue).toBeInstanceOf(Function);
  });

  it('should define correct metadata for firstDummyRefs property', () => {
    const metadata: ICaepContentChildrenMapping[] = Reflect.getMetadata(CaepContentChildrenKey, dummyInstance);
    expect(metadata[0].targetKey).toEqual('firstDummyRefs');
    expect(metadata[0].metadata.selector).toEqual(FirstDummyClass);
    expect(metadata[0].metadata.opts.descendants).toBeFalse();
  });

  it('should define correct metadata for secondDummyRefs property', () => {
    const metadata: ICaepContentChildrenMapping[] = Reflect.getMetadata(CaepContentChildrenKey, dummyInstance);
    expect(metadata[1].targetKey).toEqual('secondDummyRefs');
    expect(metadata[1].metadata.selector).toEqual(SecondDummyClass);
    expect(metadata[1].metadata.opts.descendants).toBeTrue();
  });

  it('should append thirdDummyRefs metadata to firstDummyRefs and secondDummyRefs metadata', () => {
    const metadata: ICaepContentChildrenMapping[] = Reflect.getMetadata(CaepContentChildrenKey, dummyInstance);
    expect(metadata.length).toEqual(3);
    expect(metadata[2].targetKey).toEqual('thirdDummyRefs');
    expect(metadata[2].metadata.selector).toEqual(ThirdDummyClass);
    expect(metadata[2].metadata.opts.descendants).toBeFalse();
  });
});
