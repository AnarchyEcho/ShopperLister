import { createApp } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';
import App from './App.vue';
import Home from './pages/index.vue';
import Lists from './pages/lists.vue';
import { addIcons, OhVueIcon } from 'oh-vue-icons';
import {
  MdHome,
  FaListUl,
  FaFilter,
  BiChevronDown,
  MdPlaylistadd,
} from 'oh-vue-icons/icons';

addIcons(
  MdHome,
  FaListUl,
  FaFilter,
  BiChevronDown,
  MdPlaylistadd
);

const routes = [
  { path: '/', component: Home },
  { path: '/lists', component: Lists },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

const app = createApp(App);

app.component('VIcon', OhVueIcon);

app.use(router).mount('#app');
