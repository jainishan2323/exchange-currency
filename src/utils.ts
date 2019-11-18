export const getExchangedRate = (amount: string, exchangerate: number): string => {
    return amount ? (parseFloat(amount) * exchangerate).toFixed(2) : '0'
}