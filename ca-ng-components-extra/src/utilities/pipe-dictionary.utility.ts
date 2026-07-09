import { PipeTransform, Type } from '@angular/core';

export class CaepPipeDictionary {
  [key: string]: Type<PipeTransform>;
}

export const caepPipes = {};
