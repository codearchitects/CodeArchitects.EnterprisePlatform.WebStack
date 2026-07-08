import { CaepPipeTransform } from '../pipes';
import { CaepFormControlMode } from '../utilities';
import { CaepPipeMapperService } from './pipe-mapper.service';

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

describe('CaepPipeMapperService', () => {
  let pipeMapper: CaepPipeMapperService,
    mockPipeDictionary,
    pipeName = 'dummy';

  beforeEach(() => {
    mockPipeDictionary = { [pipeName]: DummyPipe };
    pipeMapper = new CaepPipeMapperService(mockPipeDictionary);
  });

  describe('findPipeByName', () => {
    it('should return correct class', () => {
      const expectedClass = DummyPipe;
      const actualClass = pipeMapper.findPipeByName(pipeName);
      expect(actualClass).toEqual(expectedClass);
    });

    it('should return undefined if does not exist a pipe mapping', () => {
      const actualValue = pipeMapper.findPipeByName('unknown');
      expect(actualValue).toBeUndefined();
    });

    it('should return undefined if given pipe name is not defined', () => {
      let actualValue = pipeMapper.findPipeByName(null);
      expect(actualValue).toBeUndefined();
      actualValue = pipeMapper.findPipeByName(undefined);
      expect(actualValue).toBeUndefined();
    });
  });
});
