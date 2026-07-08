import { NumeralPipe } from '../pipes/numeral.pipe';
import numeral from 'numeral';

class ShNumeral {
  private static _instance: NumeralPipe;

  private constructor() {
  }

  public static get Instance() {
    if (!ShNumeral._instance) {
      ShNumeral._instance = new NumeralPipe();
      numeral.locale(navigator.language.substring(0, 2));
    }
    return ShNumeral._instance;
  }
}

export const shNumeral = ShNumeral.Instance;
