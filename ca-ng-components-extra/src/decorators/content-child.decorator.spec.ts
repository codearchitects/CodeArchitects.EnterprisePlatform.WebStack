import { CaepContentChild, CaepContentChildKey, ICaepContentChildMapping } from './content-child.decorator';

class FirstDummyClass {}

class SecondDummyClass {}

class ThirdDummyClass {}

class DummyComponent {
  @CaepContentChild(FirstDummyClass)
  public firstDummyRef: FirstDummyClass;

  @CaepContentChild(SecondDummyClass)
  public secondDummyRef: SecondDummyClass;
}

class DummyChildComponent extends DummyComponent {
  @CaepContentChild(ThirdDummyClass)
  public thirdDummyRef: ThirdDummyClass;

  constructor() {
    super();
  }
}

describe('CaepContentChild decorator', () => {
  let dummyInstance: DummyChildComponent;

  beforeEach(() => {
    dummyInstance = new DummyChildComponent();
  });

  it('should return a function', () => {
    const actualValue = CaepContentChild(FirstDummyClass);
    expect(actualValue).toBeInstanceOf(Function);
  });

  it('should define correct metadata for firstDummyRef property', () => {
    const metadata: ICaepContentChildMapping[] = Reflect.getMetadata(CaepContentChildKey, dummyInstance);
    expect(metadata[0].targetKey).toEqual('firstDummyRef');
    expect(metadata[0].metadata.selector).toEqual(FirstDummyClass);
  });

  it('should append secondDummyRef and thirdDummyRef metadata to firstDummyRef metadata', () => {
    const metadata: ICaepContentChildMapping[] = Reflect.getMetadata(CaepContentChildKey, dummyInstance);
    expect(metadata.length).toEqual(3);
    expect(metadata[1].targetKey).toEqual('secondDummyRef');
    expect(metadata[1].metadata.selector).toEqual(SecondDummyClass);
    expect(metadata[2].targetKey).toEqual('thirdDummyRef');
    expect(metadata[2].metadata.selector).toEqual(ThirdDummyClass);
  });
});
