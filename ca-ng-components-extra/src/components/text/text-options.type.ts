import { CaepOption } from "../../decorators";
import { PickAll } from "../../utilities";
import { CaepBaseInputOptions } from "../base";

/**
 * Text Component options contract
 */
export interface ICaepTextOptions extends PickAll<CaepTextOptions> { };

/**
 * Text Component options
 */
export class CaepTextOptions extends CaepBaseInputOptions<string> {

  @CaepOption({ defaultValue: 'text' })
  type?: 'text' | 'password' | 'email';

  constructor(options?: ICaepTextOptions) {
    super(options);
  }

}