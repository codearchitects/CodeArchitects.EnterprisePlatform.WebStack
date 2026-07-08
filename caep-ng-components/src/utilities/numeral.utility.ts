import numeral from 'numeral';
import { CaepNumeralPipe } from '../pipes/numeral.pipe';

class CaepNumeral {
  private static _instance: CaepNumeralPipe;

  private constructor() {}

  public static get Instance() {
    if (!CaepNumeral._instance) {
      CaepNumeral._instance = new CaepNumeralPipe();
      numeral.locale(navigator.language.substring(0, 2));
    }
    return CaepNumeral._instance;
  }
}

export const caepNumeral = CaepNumeral.Instance;
