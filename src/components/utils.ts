export const getExchangedRate = (amount: string, exchangerate: number) => {
    return amount ? (parseFloat(amount) * exchangerate).toFixed(2) : 0
}