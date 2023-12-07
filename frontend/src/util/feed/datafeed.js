import { makeApiRequest, generateSymbol, parseFullSymbol } from './helpers.js'

// DatafeedConfiguration implementation
const configurationData = {
  // Represents the resolutions for bars supported by your datafeed
  supported_resolutions: ['D', '2D', '3D', 'W', '3W', 'M', '6M'],
  // The `exchanges` arguments are used for the `searchSymbols` method if a user selects the exchange
  exchanges: [
    { value: 'Bitfinex', name: 'Bitfinex', desc: 'Bitfinex' },
    { value: 'Kraken', name: 'Kraken', desc: 'Kraken bitcoin exchange' }
    // { value: '', name: 'All Exchanges', desc: '' },
    // { value: 'NasdaqNM', name: 'NasdaqNM', desc: 'NasdaqNM' },
    // { value: 'NYSE', name: 'NYSE', desc: 'NYSE' }
  ],
  // The `symbols_types` arguments are used for the `searchSymbols` method if a user selects this symbol type
  symbols_types: [{ name: 'crypto', value: 'crypto' }]
}

// Obtains all symbols for all exchanges supported by CryptoCompare API
async function getAllSymbols() {
  const data = await makeApiRequest('data/v3/all/exchanges')
  let allSymbols = []

  for (const exchange of configurationData.exchanges) {
    const pairs = data.Data[exchange.value].pairs

    for (const leftPairPart of Object.keys(pairs)) {
      const symbols = pairs[leftPairPart].map((rightPairPart) => {
        const symbol = generateSymbol(exchange.value, leftPairPart, rightPairPart)
        return {
          symbol: symbol.short,
          full_name: symbol.full,
          description: symbol.short,
          exchange: exchange.value,
          type: 'crypto'
        }
      })
      allSymbols = [...allSymbols, ...symbols]
    }
    console.log('====================================');
    console.log(allSymbols);
    console.log('====================================');
  }
  return allSymbols
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
    const symbolItem = symbols.find(({ full_name }) => full_name === symbolName)
    if (!symbolItem) {
      console.log('[resolveSymbol]: Cannot resolve symbol', symbolName)
      onResolveErrorCallback('Cannot resolve symbol')
      return
    }
    // Symbol information object
    const symbolInfo = {
      ticker: symbolItem.full_name,
      name: symbolItem.symbol,
      description: symbolItem.description,
      type: symbolItem.type,
      session: '24x7',
      timezone: 'Etc/UTC',
      exchange: symbolItem.exchange,
      minmov: 1,
      pricescale: 100,
      has_intraday: false,
      visible_plots_set: 'ohlc',
      has_weekly_and_monthly: false,
      supported_resolutions: configurationData.supported_resolutions,
      volume_precision: 2,
      data_status: 'streaming'
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
    const parsedSymbol = parseFullSymbol(symbolInfo.full_name)
    const urlParameters = {
      e: parsedSymbol.exchange,
      fsym: parsedSymbol.fromSymbol,
      tsym: parsedSymbol.toSymbol,
      toTs: to,
      limit: 2000
    }
    const query = Object.keys(urlParameters)
      .map((name) => `${name}=${encodeURIComponent(urlParameters[name])}`)
      .join('&')
    try {
      const data = await makeApiRequest(`data/histoday?${query}`)
      if ((data.Response && data.Response === 'Error') || data.Data.length === 0) {
        // "noData" should be set if there is no data in the requested period
        onHistoryCallback([], { noData: true })
        return
      }
      let bars = []
      data.Data.forEach((bar) => {
        if (bar.time >= from && bar.time < to) {
          bars = [
            ...bars,
            {
              time: bar.time * 1000,
              low: bar.low,
              high: bar.high,
              open: bar.open,
              close: bar.close
            }
          ]
        }
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
