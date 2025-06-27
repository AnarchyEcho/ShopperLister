import { createApp } from "vue";
import { createMemoryHistory, createRouter } from "vue-router";
import App from "./App.vue";
import Home from './pages/index.vue'
import Lists from "./pages/lists.vue";

const routes = [
  { path: '/', component: Home },
  { path: '/lists', component: Lists }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

createApp(App).use(router).mount("#app");
