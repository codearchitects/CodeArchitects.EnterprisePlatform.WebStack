import { expect, use } from 'chai';
import { Activator } from '@ca-webstack/reflection';

describe('ca-reflection should', () => {

  it('expose an activator', () => {
    const obj = new Activator();
    expect(obj).to.exist;
  });

});
