<script lang="ts">
import './assets/base.css';
import application from "./components/application.vue";

export default {
  components: {application},
  data() {
    return {};
  }
};
</script>

<template>
  <div class="app-body">
    <Application/>
  </div>
</template>

<style scoped>
.app-body {
  width: 100vw;
  height: 100vh;
  background-color: #42b983;
  overflow: hidden;
}


#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
}
</style>
