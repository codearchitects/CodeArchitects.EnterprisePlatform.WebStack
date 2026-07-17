import { catchWhen, GetEmptyBuffer, VB6Truncate } from './functions';

describe('Function Truncate Suite', () => {

    test('should be defined', () => {
        const actual = VB6Truncate;
        expect(actual).toBeDefined();
    });

    test('should fill string with spaces', () => {
        const actual = VB6Truncate('foobar', 10);
        expect(actual).toEqual('foobar    ');
    });

    test('should fill string with padchar', () => {
        const actual = VB6Truncate('foobar', 10, '.');
        expect(actual).toEqual('foobar....');
    });

    test('should truncate string', () => {
        const actual = VB6Truncate('foobar', 3);
        expect(actual).toEqual('foo');
    });

    test('should use spaces to create a string', () => {
        const actual = VB6Truncate(undefined, 4);
        expect(actual).toEqual('    ');
    });

    test('should use padchar to create a string', () => {
        const actual = VB6Truncate(undefined, 4, '-');
        expect(actual).toEqual('----');
    });
});

describe('Function GetEmptyBuffer Suite', () => {

    test('should be defined', () => {
        const actual = GetEmptyBuffer;
        expect(actual).toBeDefined();
    });

    test('should fill string with spaces', () => {
        const actual = VB6Truncate('foobar', 10);
        expect(actual).toEqual('foobar    ');
    });

    test('should fill string with padchar', () => {
        const actual = GetEmptyBuffer(10);
        expect(actual).toEqual('          ');
    });
});

describe('Function catchWhen Suite', () => {

    test('should be defined', () => {
        const actual = catchWhen;
        expect(actual).toBeDefined();
    });

    test('should throw error when label is null', () => {
        let onErrorGoToLabel: string;
        try {
            throw new Error('Sample error');
        } catch (error) {
            const actual = catchWhen.bind(undefined, error, onErrorGoToLabel);
            const expected = error;
            expect(actual).toThrow(expected);
        }
    });

    test('should throw error when label is null', () => {
        let onErrorGoToLabel: string;
        try {
            onErrorGoToLabel = 'SampleFunction_Err';
            throw new Error('Sample error');
        } catch (error) {
            let expected = false;
            const actual = catchWhen.bind(
                undefined,
                error,
                onErrorGoToLabel,
                {
                    'SampleFunction_Err': () => {
                        console.log('Hello');
                        expected = true;
                    }
                });
            expect(actual).not.toThrow(error);
            expect(expected).toEqual(true);
        }
    });

    test('should throw error when label is defined but doesn\'t match when case', () => {
        let onErrorGoToLabel: string;
        try {
            onErrorGoToLabel = 'WrongFunction_Err';
            throw new Error('Sample error');
        } catch (error) {
            let expected = false;
            const actual = catchWhen.bind(
                undefined,
                error,
                onErrorGoToLabel,
                {
                    'SampleFunction_Err': () => {
                        console.log('Hello');
                        expected = true;
                    }
                });
            expect(actual).toThrow(error);
            expect(expected).toEqual(false);
        }
    });
});