import { getExchangedRate } from '../utils';

describe('Test util function getExchange rate', () => {
    test('test exchange rate', () => {
        expect(getExchangedRate("30", 1.3)).toEqual("39.00");
    });
    
    test('test exchange rate with null amount', () => {
        expect(getExchangedRate("", 1.3)).toEqual("0");
    });
    
    test('test exchange rate for decimal points', () => {
        expect(getExchangedRate("25", 1.897)).toEqual("47.42");
    });
});
