<script setup lang="ts">
import Header from './components/Header.vue';
import { onBackKeyDown } from 'tauri-plugin-app-events-api';
onBackKeyDown(() => {
  console.log("tried backing");
  return false;
})
</script>

<template>
  <div class="app">
    <component :is="Header" />
    <RouterView />
  </div>
</template>

<style lang="scss">
:root {
  height: 100vh;
  margin: 0;
  padding: 0;
}

.app {
  border: solid white 2px;
  height: 98vh;
}

a {
  font-weight: 500;
  color: #FAFAFA;
  text-decoration: inherit;
}

h1 {
  text-align: center;
  color: #ffa500;
}

@media (prefers-color-scheme: dark) {
  :root {
    color: #f6f6f6;
    background-color: #232323;
  }

  a {
    color: #232323;
  }
}
</style>
