<script setup lang="ts">
import { invoke } from '@tauri-apps/api/core';
import { onBackKeyDown } from 'tauri-plugin-app-events-api';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
const localStorage = window.localStorage;

const router = useRouter();
const route = useRoute();
const routerState = ref(localStorage.getItem("routerState"));

const handleState = () => {
  const path = route.path != '/' ? route.path.replace('/', '') : '/';
  localStorage.setItem("routerState", path)
  routerState.value = localStorage.getItem("routerState")
}
onBackKeyDown(async () => {
  if (routerState.value != '/') {
    await router.replace("/")
    handleState();
    return false;
  } else {
    // Wouldnt be needed if return true did as advertised.
    // giga jank and kinda slow but at least it exits the app.
    await invoke("exit")
  }
})

const handleFilter = () => {
  // TODO: Create filter/sort logic
}
</script>

<template>
  <div class="container">
    <div @click="handleState">
      <RouterLink to="/" v-if="routerState != '/'">
        <v-icon name="md-home" scale="2" />
      </RouterLink>
      <RouterLink to="/lists" v-else>
        <v-icon name="fa-list-ul" scale="2" />
      </RouterLink>
    </div>
    <p class="title text"
      v-text="routerState && routerState != '/' ? routerState?.charAt(0).toUpperCase() + routerState?.slice(1) : 'ShopperLister'" />
    <div @click="handleFilter">
      <RouterLink to="#">
        <v-icon name="fa-filter" scale="2" />
      </RouterLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  background-color: #ffa500;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
}

.title {
  padding: 0;
  margin: 0;
  font-size: 25px;
  text-align: center;
  align-self: center;
}

.text {
  color: #FAFAFA;
}

@media (prefers-color-scheme: dark) {
  .text {
    color: #232323;
  }
}
</style>
