// Makes requests to CryptoCompare API
import { getData } from '../../api/tradingview'

export async function makeApiRequest(path) {
  try {
    const response1 = await getData(path)
    return response1
  } catch (error) {
    throw new Error(`CryptoCompare request error: ${error.status}`)
  }
}

// Generates a symbol ID from a pair of the coins
export function generateSymbol(exchange, fromSymbol, toSymbol) {
  const short = `${fromSymbol}/${toSymbol}`
  return {
    short,
    full: `${exchange}:${short}`
  }
}

// Returns all parts of the symbol
export function parseFullSymbol(fullSymbol) {
  const match = fullSymbol.match(/^(\w+):(\w+)\/(\w+)$/)
  if (!match) {
    return null
  }
  return { exchange: match[1], fromSymbol: match[2], toSymbol: match[3] }
}
