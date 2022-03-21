<script>
import LeafletMap from "./leaflet-map.vue";

export default {
  name: "ApplicationRoot",
  components: { LeafletMap },
};
</script>

<template>
  <div class="l-fit application-root">
    <header class="l-centered header">
      <h1>
        Data viz vue template: Edit this component (application-root) to create
        your web application
      </h1>
    </header>
    <main class="l-centered main">
      <LeafletMap>
        <template #projected-svg="projectedSVGProps">
          <g :style="projectedSVGProps.reverseZoomAnimScaleStyles">
            <text>Text Placeholder</text>
            <circle fill="red" r="10"></circle>
          </g>
        </template>
      </LeafletMap>
    </main>
    <footer class="l-centered footer">Footer</footer>
  </div>
</template>

<style scoped>
.l-centered {
  max-width: 100%;
  width: 800px;
  margin: 0 auto;
}

.application-root {
  display: flex;
  flex-direction: column;
}

.header {
  height: 100px;
  flex-shrink: 0;
}

.main {
  height: 100%;
}

.footer {
  height: 20px;
  flex-shrink: 0;
}
</style>
