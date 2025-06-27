<script setup lang="ts">
import Header from './components/Header.vue';

!window.localStorage.getItem("routerState") && window.localStorage.setItem("routerState", "/")
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
  height: 98vh;
}

a {
  color: #FAFAFA;
  text-decoration: none;
}

h1 {
  margin: 0;
  padding: 0;
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
