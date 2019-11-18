export interface IWallet {
    id: string;
    displayName: string;
    amount: number;
    symbol: string;
}

export interface IAppState {
    Wallet: {[k: string]: IWallet}
}