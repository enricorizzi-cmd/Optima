import { describe, expect, it } from 'vitest';
import { getEnv } from './env';

describe('env', () => {
  it('throws when env is invalid', () => {
    expect(() => getEnv()).toThrowError();
  });
});
