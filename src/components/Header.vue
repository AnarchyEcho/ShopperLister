<script setup lang="ts">

</script>

<template>
  <div class="container">
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/lists">Lists</RouterLink>
    <p>filter ph</p>
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-content: space-between;
  padding: 10px;
  border: solid white 2px;
}
</style>
