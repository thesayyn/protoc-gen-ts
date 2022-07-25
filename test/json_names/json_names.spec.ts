import { JsonNamesMessage, ColorSpace } from './json_names';

describe('JSON Names', () => {
  it('should be constructable with camel case fields', () => {
    const message = new JsonNamesMessage({
      someStrings: ['a', 'b', 'c'],
      anInteger: 123,
      aNestedMessage: new JsonNamesMessage.NestedMessage({
        aNestedInteger: 456,
      }),
      colorSpace: ColorSpace.RED_GREEN_BLUE,
      aSingleString: 'spam',
    });

    expect(message.someStrings).toEqual(['a', 'b', 'c']);
    expect(message.anInteger).toEqual(123);
    expect(message.aNestedMessage?.aNestedInteger).toEqual(456);
    expect(message.colorSpace).toEqual(ColorSpace.RED_GREEN_BLUE);
    expect(message.aSingleString).toEqual('spam');
    expect(ColorSpace[message.colorSpace]).toEqual('RED_GREEN_BLUE');
  });

  it('should support fromObject with camel case fields', () => {
    const message = JsonNamesMessage.fromObject({
      someStrings: ['a', 'b', 'c'],
      anInteger: 123,
      aNestedMessage: {
        aNestedInteger: 456,
      },
      colorSpace: ColorSpace.RED_GREEN_BLUE,
      aSingleString: 'spam',
    });

    expect(message.someStrings).toEqual(['a', 'b', 'c']);
    expect(message.anInteger).toEqual(123);
    expect(message.aNestedMessage?.aNestedInteger).toEqual(456);
    expect(message.colorSpace).toEqual(ColorSpace.RED_GREEN_BLUE);
    expect(message.aSingleString).toEqual('spam');
    expect(ColorSpace[message.colorSpace]).toEqual('RED_GREEN_BLUE');
  });

  it('should output camel case fields from toObject', () => {
    const message = JsonNamesMessage.fromObject({
      someStrings: ['a', 'b', 'c'],
      anInteger: 123,
      aNestedMessage: {
        aNestedInteger: 456,
      },
      colorSpace: ColorSpace.RED_GREEN_BLUE,
      aSingleString: 'spam',
    });

    expect(message.toObject()).toEqual({
      someStrings: ['a', 'b', 'c'],
      anInteger: 123,
      aNestedMessage: {
        aNestedInteger: 456,
      },
      colorSpace: ColorSpace.RED_GREEN_BLUE,
      anOptionalString: '',
      aSingleString: 'spam',
      aSingleNumber: 0,
    });
  });

  it('should support setters', () => {
    const message = new JsonNamesMessage();
    message.someStrings = ['d', 'e', 'f'];
    message.anInteger = 789;
    message.aNestedMessage = new JsonNamesMessage.NestedMessage();
    message.aNestedMessage.aNestedInteger = 102;
    message.colorSpace = ColorSpace.CYAN_YELLOW_MAGENTA_BLACK;
    message.aSingleNumber = 456;

    expect(message.toObject()).toEqual({
      someStrings: ['d', 'e', 'f'],
      anInteger: 789,
      aNestedMessage: {
        aNestedInteger: 102,
      },
      colorSpace: ColorSpace.CYAN_YELLOW_MAGENTA_BLACK,
      anOptionalString: '',
      aSingleString: '',
      aSingleNumber: 456,
    });
  });

  it('should expose oneof fields in camel case', () => {
    const message = new JsonNamesMessage();
    expect(message.mut_ex_field).toBe('none');
    message.aSingleNumber = 123;
    expect(message.mut_ex_field).toBe('aSingleNumber');
    message.aSingleString = 'abcdef';
    expect(message.mut_ex_field).toBe('aSingleString');
  });

  it('should expose presence fields in camel case', () => {
    const message = new JsonNamesMessage();
    expect(message.hasASingleString).toBe(false);
    message.aSingleString = 'abcdef';
    expect(message.hasASingleString).toBe(true);
    message.aSingleString = undefined!;
    expect(message.hasASingleString).toBe(false);
  });
});
