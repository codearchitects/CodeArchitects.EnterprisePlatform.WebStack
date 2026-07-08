import { CaepPipeTransform } from '../pipes';
import { CaepFormControlMode, caepPipes } from '../utilities';
import { CaepPipe } from './pipe.decorator';

@CaepPipe({
  name: 'dummy'
})
class DummyPipe extends CaepPipeTransform<number, string> {
  public transform(value: number, mode: CaepFormControlMode, args: any): string {
    return '';
  }
  public revert(value: string, mode: CaepFormControlMode, args: any): number {
    return 0;
  }
  public tolerantCheck(value: string, mode: CaepFormControlMode, args: any): boolean {
    return true;
  }
}

describe('Pipe decorator', () => {
  let dummyInstance: DummyPipe;

  beforeEach(() => {
    dummyInstance = new DummyPipe();
  });

  it('should return a function', () => {
    const actualValue = CaepPipe({ name: 'test' });
    expect(actualValue).toBeInstanceOf(Function);
  });

  it("should append new pipe mapping to pipe's dictionary", () => {
    expect(caepPipes['dummy']).toBeDefined();
    expect(caepPipes['dummy']).toEqual(DummyPipe);
  });
});
