import dayjs from 'dayjs'
import { makeApiRequest, generateSymbol, parseFullSymbol } from './helpers copy'

// DatafeedConfiguration implementation
const configurationData = {
  // Represents the resolutions for bars supported by your datafeed
  supported_resolutions: ['D', '2D', '3D', 'W', '3W', 'M', '6M'],
  // The `exchanges` arguments are used for the `searchSymbols` method if a user selects the exchange
  exchanges: [
    { value: 'Bitfinex', name: 'Bitfinex', desc: 'Bitfinex' },
    { value: 'Kraken', name: 'Kraken', desc: 'Kraken bitcoin exchange' }
  ],
  // The `symbols_types` arguments are used for the `searchSymbols` method if a user selects this symbol type
  symbols_types: [{ name: 'crypto', value: 'crypto' }]
}

// Obtains all symbols for all exchanges supported by CryptoCompare API
async function getAllSymbols() {
  const data = await makeApiRequest('getStockList')
  // data.forEach((element) => {
  //   // element.exchange = element.ts_code
  //   element.description = element.ts_code
  //   element.type = 'crypto'
  // })
  console.log(data)
  return data
}

export default {
  onReady: (callback) => {
    console.log('[onReady]: Method call')
    setTimeout(() => callback(configurationData))
  },

  searchSymbols: async (userInput, exchange, symbolType, onResultReadyCallback) => {
    console.log('[searchSymbols]: Method call')
    const symbols = await getAllSymbols()
    const newSymbols = symbols.filter((symbol) => {
      const isExchangeValid = exchange === '' || symbol.exchange === exchange
      const isFullSymbolContainsInput =
        symbol.full_name.toLowerCase().indexOf(userInput.toLowerCase()) !== -1
      return isExchangeValid && isFullSymbolContainsInput
    })
    onResultReadyCallback(newSymbols)
  },

  resolveSymbol: async (
    symbolName,
    onSymbolResolvedCallback,
    onResolveErrorCallback,
    extension
  ) => {
    console.log('[resolveSymbol]: Method call', symbolName)
    const symbols = await getAllSymbols()
    const symbolItem = symbols.find(({ symbol }) => symbol === symbolName)
    if (!symbolItem) {
      console.log('[resolveSymbol]: Cannot resolve symbol', symbolName)
      onResolveErrorCallback('Cannot resolve symbol')
      return
    }
    // Symbol information object
    const symbolInfo = {
      ticker: symbolItem.name,
      name: symbolItem.symbol,
      description: symbolItem.name,
      type: '',
      session: '24x7',
      timezone: 'Etc/UTC',
      minmov: 1,
      pricescale: 100,
      has_intraday: false,
      visible_plots_set: 'ohlc',
      has_weekly_and_monthly: false,
      supported_resolutions: configurationData.supported_resolutions,
      volume_precision: 2,
      data_status: 'streaming',
      ts_code: symbolItem.ts_code
    }
    console.log('[resolveSymbol]: Symbol resolved', symbolName)
    onSymbolResolvedCallback(symbolInfo)
  },

  getBars: async (
    symbolInfo,
    resolution,
    rangeStartDate,
    rangeEndDate,
    onHistoryCallback,
    onErrorCallback
  ) => {
    //版本原因修改getBars
    // getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
    const from = rangeStartDate
    const to = rangeEndDate
    // const { from, to, firstDataRequest } = periodParams
    console.log('[getBars]: Method call', symbolInfo, resolution, from, to)
    // const parsedSymbol = parseFullSymbol(symbolInfo.full_name)
    const parsedSymbol = symbolInfo

    const urlParameters = {
      ts_code: parsedSymbol.ts_code,
      start_date: from,
      end_date: to
    }
    const query = Object.keys(urlParameters)
      .map((name) => `${name}=${encodeURIComponent(urlParameters[name])}`)
      .join('&')
    try {
      const data = await makeApiRequest(`getHistaryData?${query}`)

      if (data.length === 0) {
        onHistoryCallback([], { noData: true })
        return
      }
      let bars = []
      data.forEach((bar) => {
        bars = [
          ...bars,
          {
            time: dayjs(bar.trade_date).unix() * 1000,
            low: bar.low,
            high: bar.high,
            open: bar.open,
            close: bar.close
          }
        ]
      })
      console.log(`[getBars]: returned ${bars.length} bar(s)`)
      onHistoryCallback(bars, { noData: false })
    } catch (error) {
      console.log('[getBars]: Get error', error)
      onErrorCallback(error)
    }
  },

  subscribeBars: (
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscriberUID,
    onResetCacheNeededCallback
  ) => {
    console.log('[subscribeBars]: Method call with subscriberUID:', subscriberUID)
  },
  unsubscribeBars: (subscriberUID) => {
    console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID)
  }
}
