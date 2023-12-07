<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import TradingView from './views/HomeView.vue'
</script>

<template>
  <RouterView class="content" />
</template>

<style scoped>

.content {
  height: 100%;
}
</style>
