/**
 * SignalR Logger
 */
 export class SignalRLogger {
  /**
   * Prints an highlighted message to console
   * @param message Message to be printed
   */
  public static log(message: string) {
    console.log(`%c SIGNALR: ${message}`, 'background: #222; color: lightgreen');
  }

  /**
   * Prints an highlighted error message to console
   * @param message Error message to be printed
   */
  public static error(message: string) {
    console.log(`%c SIGNALR: ${message}`, 'background: #222; color: red');
  }

  /**
   * Prints an highlighted warn message to console
   * @param message Warn message to be printed
   */
  public static warn(message: string) {
    console.log(`%c SIGNALR: ${message}`, 'background: #222; color: yellow');
  }
}
