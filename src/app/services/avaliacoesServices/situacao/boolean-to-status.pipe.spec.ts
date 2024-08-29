import { BooleanToStatusPipe } from './boolean-to-status.pipe';

describe('BooleanToStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new BooleanToStatusPipe();
    expect(pipe).toBeTruthy();
  });
});
