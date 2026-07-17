import { expect, use } from 'chai';
import { DateTime } from '@ca-webstack/data-structures';

describe('data-structures should', () => {

  it('expose a dateTime class', () => {
    const obj = new DateTime();
    expect(obj).to.exist;
  });

});
