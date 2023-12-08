<script setup lang="ts">
import { onMounted } from 'vue';
// import DataFeeds from '@/util/feed/datafeed.js'
import DataFeeds from '@/util/feed/datafeed copy.js'

onMounted(() => {
  setChart()
})

const setChart = () => {
  new window.TradingView.widget({
    fullscreen: true, //全屏
    // symbol: 'Bitfinex:BTC/USD', // 产品
    symbol: '000001',
    // symbol: 'AAPL',
    interval: '1D',  // 时间间隔
    container_id: "chart_container",

    //	BEWARE: no trailing slash is expected in feed URL
    // datafeed: new window.Datafeeds.UDFCompatibleDatafeed("https://demo-feed-data.tradingview.com"),
    datafeed: DataFeeds,
    library_path: "charting_library/",
    locale: getParameterByName('lang') || "zh",

    // disabled_features: ["use_localstorage_for_settings"],
    // enabled_features: ["study_templates"],
    // charts_storage_url: 'http://saveload.tradingview.com',
    // charts_storage_api_version: "1.1",
    // client_id: 'tradingview.com',
    // user_id: 'public_user_id',
    theme: getParameterByName('theme'),
  });
}

//本地语言环境，配色环境
function getParameterByName(name: string) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
</script>

<template>
  <div id="chart_container"></div>
</template>

<style></style>
../util/feed/datafeed