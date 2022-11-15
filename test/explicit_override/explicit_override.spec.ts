import { ExplicitOverrideMessage } from './explicit_override';

describe('Explicit Override', () => {
  it('should compile with noImplicitOverride', () => {
    const message = new ExplicitOverrideMessage({
      example: 1,
    });

    expect(message.example).toEqual(1);
  });
});
