import 'reflect-metadata';
import { expect, use } from 'chai';
import { DataContext } from '@ca-webstack/data-context';

describe('lib-ts-seed should', () => {

  it('expose a logger', () => {
    const obj = new DataContext();
    expect(obj).to.exist;
  });

});
