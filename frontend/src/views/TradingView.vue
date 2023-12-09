<script setup lang="ts">
import { onMounted } from 'vue';
import DataFeeds from '@/util/feed/datafeed.js'

onMounted(() => {
  setChart()
})

const setChart = () => {
  new window.TradingView.widget({
    fullscreen: true, //全屏
    symbol: '000001',
    interval: 'D',  // 时间间隔
    timeframe: '48M', //时间范围 默认查询4年的
    container_id: "chart_container",
    timezone: "America/New_York",

    //	BEWARE: no trailing slash is expected in feed URL
    // datafeed: new window.Datafeeds.UDFCompatibleDatafeed("https://demo-feed-data.tradingview.com"),
    datafeed: DataFeeds,
    library_path: "charting_library/",
    locale: getParameterByName('lang') || "zh",
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