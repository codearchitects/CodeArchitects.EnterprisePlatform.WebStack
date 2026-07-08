import { PipeTransform } from '@angular/core';
import { CaepFormControlMode } from '../utilities';

export abstract class CaepPipeTransform<T = any, V = string, Z = any> implements PipeTransform {
  /*public abstract transform(value: T, mode: CaepFormControlMode, ...args: any[]): V;
    public abstract revert(value: V, mode: CaepFormControlMode, ...args: any[]): T;
    public abstract tolerantCheck(value: V, mode: CaepFormControlMode, ...args: any[]): boolean;*/

  /**
   * Parses model property value to retrieve a new form control value
   *
   * @param value model value to transform
   * @param mode form control mode
   * @param args transform args
   */
  public abstract transform(value: T, mode: CaepFormControlMode, args: Z): V;

  /**
   * Parses control value to retrieve a new model value
   *
   * @param value control value to revert to a model value
   * @param mode form control mode
   * @param args revert args
   */
  public abstract revert(value: V, mode: CaepFormControlMode, args: Z): T;

  /**
   * Performs a tolerant check on the new form control value
   *
   * @param value control value
   * @param mode form control mode
   * @param args tolerant check args
   */
  public abstract tolerantCheck(value: V, mode: CaepFormControlMode, args: Z): boolean;
}
