<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router'
const localStorage = window.localStorage;

const route = useRoute();
let routerState = ref(localStorage.getItem("routerState"))
const handleState = () => {
  const path = route.path != '/' ? route.path.replace('/', '') : '/';
  localStorage.setItem("routerState", path)
  routerState.value = localStorage.getItem("routerState")
}
</script>

<template>
  <div class="container">
    <div @click="handleState">
      <RouterLink class="link" to="/" v-if="routerState != '/'">Home</RouterLink>
      <RouterLink class="link" to="/lists" v-else>Lists</RouterLink>
    </div>
    <p class="title text">ShopperLister</p>
    <p class="title text">F</p>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
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
}

.text {
  color: #232323;
}

@media (prefers-color-scheme: light) {
  .text {
    color: #FAFAFA;
  }
}
</style>
