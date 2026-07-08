import { caepPipes } from '../utilities/pipe-dictionary.utility';

/**
 * Description of CaepPipe decorator params.
 */
export interface ICaepPipeParams {
  /**
   * Pipe selector
   */
  name: string;
}

/**
 * Decorator useful to add pipes to pipe dictionary.
 *
 *
 * @param params ICaepPipeParams object for params specification
 *
 * ### Example
 * ```
 * @CaepPipe({
 *  name: 'myCurrency'
 * })
 * ```
 */
export function CaepPipe(params: ICaepPipeParams) {
  return function (constructor: Function) {
    caepPipes[params.name] = constructor;
    //Pipe(params)(constructor);
  };
}
