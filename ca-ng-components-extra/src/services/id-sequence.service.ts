import { Injectable } from '@angular/core';

@Injectable()
export class CaepIdSequenceService {
  private base = 'id';
  private current = 0;

  /**
   * Gets next identifier
   */
  public next() {
    return this.base + this.current++;
  }
}
