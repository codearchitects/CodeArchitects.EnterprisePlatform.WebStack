import { Injectable, PipeTransform, Type } from '@angular/core';
import { isNoU } from '../utilities/common.utility';
import { CaepPipeDictionary } from '../utilities/pipe-dictionary.utility';

@Injectable()
export class CaepPipeMapperService {
  constructor(private _pipes: CaepPipeDictionary) {}

  findPipeByName(pipeName: string): Type<PipeTransform> | undefined {
    if (isNoU(pipeName)) {
      console.warn('Pipe not found.');
      return undefined;
    } else {
      let pipe = this._pipes[pipeName];
      if (pipe) {
        return pipe;
      } else {
        console.warn('Pipe not found.');
        return undefined;
      }
    }
  }
}
