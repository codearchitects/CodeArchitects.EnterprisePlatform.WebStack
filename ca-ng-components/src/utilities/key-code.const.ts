export const KeyCode = {
  BACKSPACE: 8,
  TAB: 9,
  ENTER: 13,
  SHIFT: 16,
  CTRL: 17,
  ALT: 18,
  PAUSE: 19,
  CAPSLOCK: 20,
  ESC: 27,
  SPACE: 32,
  PAGE_UP: 33,
  PAGE_DOWN: 34,
  END: 35,
  HOME: 36,
  ARROW_LEFT: 37,
  ARROW_UP: 38,
  ARROW_RIGHT: 39,
  ARROW_DOWN: 40,
  INSERT: 45,
  DELETE: 46,
  ZERO: 48,
  ONE: 49,
  TWO: 50,
  THREE: 51,
  FOUR: 52,
  FIVE: 53,
  SIX: 54,
  SEVEN: 55,
  EIGHT: 56,
  NINE: 57,
  A: 65,
  B: 66,
  C: 67,
  D: 68,
  E: 69,
  F: 70,
  G: 71,
  H: 72,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  M: 77,
  N: 78,
  O: 79,
  P: 80,
  Q: 81,
  R: 82,
  S: 83,
  T: 84,
  U: 85,
  V: 86,
  W: 87,
  X: 88,
  Y: 89,
  Z: 90,
  LEFTWINDOWKEY: 91,
  RIGHTWINDOWKEY: 92,
  SELECTKEY: 93,
  NUMPAD0: 96,
  NUMPAD1: 97,
  NUMPAD2: 98,
  NUMPAD3: 99,
  NUMPAD4: 100,
  NUMPAD5: 101,
  NUMPAD6: 102,
  NUMPAD7: 103,
  NUMPAD8: 104,
  NUMPAD9: 105,
  MULTIPLY: 106,
  ADD: 107,
  SUBTRACT: 109,
  DECIMALPOINT: 110,
  DIVIDE: 111,
  F1: 112,
  F2: 113,
  F3: 114,
  F4: 115,
  F5: 116,
  F6: 117,
  F7: 118,
  F8: 119,
  F9: 120,
  F10: 121,
  F11: 122,
  F12: 123,
  NUMLOCK: 144,
  SCROLLLOCK: 145,
  SEMICOLON: 186,
  è: 186,
  EQUALSIGN: 187,
  COMMA: 188,
  DASH: 189,
  PERIOD: 190,
  FORWARDSLASH: 191,
  ù: 191,
  GRAVEACCENT: 192,
  ò: 192,
  OPENBRACKET: 219,
  BACKSLASH: 220,
  CLOSEBRAKET: 221,
  ì: 221,
  SINGLEQUOTE: 222,
  à: 222
};

/**
 * Checks if key is a letter
 * @param key
 */
export function keyIsLetter(key: number) {
  return (key >= KeyCode.A
    && key <= KeyCode.Z)
    || key === KeyCode.è
    || key === KeyCode.ù
    || key === KeyCode.ò
    || key === KeyCode.ì
    || key === KeyCode.à;
}

/**
 * Checks if key is a number
 * @param key
 */
export function keyIsNumber(key: number) {
  return ((key >= KeyCode.ZERO && key <= KeyCode.NINE)
    || (key >= KeyCode.NUMPAD0 && key <= KeyCode.NUMPAD9));
}
