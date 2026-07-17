import { VB6FixedString, VB6RadioOption, Collection6 } from './models';

describe('VB6FixedString Suite', () => {

    test('should be defined', () => {
        const actual = VB6FixedString;
        expect(actual).toBeDefined();
    });

    test('should instantiate string with 10 empty spaces', () => {
        const actual = new VB6FixedString(10);
        expect(actual.value).toEqual('          ');
    });

    test('should set a 10 characters string', () => {
        const actual = new VB6FixedString(10);
        actual.value = 'Hello wow!';
        expect(actual.value).toEqual('Hello wow!');
    });

    test('should set a 10 characters string truncating a 12 characters string', () => {
        const actual = new VB6FixedString(10);
        actual.value = 'Hello world!';
        expect(actual.value).toEqual('Hello worl');
    });
});

describe('VB6RadioOption Suite', () => {

    test('should be defined', () => {
        const actual = VB6RadioOption;
        expect(actual).toBeDefined();
    });

    test('should toggle radio value', () => {
        const lookup = ['Si', 'No'];
        let value = lookup[1];
        const sut1 = new VB6RadioOption(() => value === lookup[0], () => value = lookup[0]);
        const sut2 = new VB6RadioOption(() => value === lookup[1], () => value = lookup[1]);
        expect(sut1.value).toEqual(false);
        expect(sut2.value).toEqual(true);
        expect(value).toEqual(lookup[1]);
        sut1.value = true;
        expect(sut1.value).toEqual(true);
        expect(sut2.value).toEqual(false);
        expect(value).toEqual(lookup[0]);
    });
});

describe('Collection6 Suite', () => {
    test('should be defined', () => {
        const actual = Collection6;
        expect(actual).toBeDefined();
    });

    test('should Add an item to a Collection6', () => {
        const collection = new Collection6();
        collection.Add('this is a string', 'access');
        expect(collection['access']).toEqual('this is a string');
        collection.Add(69, 'num');
        expect(collection['num']).toEqual(69);
        collection.Add('another string');
        expect(collection[0]).toEqual('another string');
    });
});