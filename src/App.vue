<script lang="ts">
import 'leaflet/dist/leaflet.css';
import './assets/base.css';

import ApplicationRoot from "./components/application-root.vue";

export default {
  components: {ApplicationRoot},
  data() {
    return {};
  }
};
</script>

<template>
  <div class="app-body">
    <ApplicationRoot/>
  </div>
</template>

<style scoped>
.app-body {
  width: 100vw;
  height: 100vh;
  background-color: #42b983;
  overflow: hidden;
}
</style>
