import { IAppState } from '../types';

const initialState = {
    Wallet: {
        GBP :{
            id: "GBP",
            displayName: "British Pound",
            amount: 200,
            symbol: "£",
        },
        USD: {
            id: "USD",
            displayName: "US Dollar",
            amount: 200,
            symbol: "$",
        },
        EUR: {
            id: "EUR",
            displayName: "Euro",
            amount: 200,
            symbol: "€"
        }
    },
}

export function rootReducer(state: IAppState = initialState, action) {
    switch (action.type) {
        case "COMPUTE_BALANCE": {
            const { fromCurrency, toCurrency, fromAmount, toAmount } = action;
            return {
                ...state,
                Wallet: {
                    ...state.Wallet,
                    [fromCurrency]: {
                        ...state.Wallet[fromCurrency],
                        amount: state.Wallet[fromCurrency].amount - fromAmount
                    },
                    [toCurrency]: {
                        ...state.Wallet[toCurrency],
                        amount: state.Wallet[toCurrency].amount + toAmount
                    }
                }
            }
        }
        default:
            return state;
    }
}