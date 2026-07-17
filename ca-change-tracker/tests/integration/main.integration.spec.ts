import 'reflect-metadata';
import { expect, use } from 'chai';
import { ObjectState } from '@ca-webstack/change-tracker';

describe('ca-change-tracker should', () => {

  it('expose an object state', () => {
    const obj = ObjectState.added;
    // expect(obj).to.exist;
  });

});
