<script lang="ts">
import { defineComponent } from "vue";
import MapPaneMixin from "../mixins/map-pane-mixin.vue";

export default defineComponent({
  name: "CanvasPane",
  mixins: [MapPaneMixin],
});
</script>

<template>
  <canvas
    ref="canvasRef"
    :height="height"
    :style="zoomAnimStyles"
    :width="width"
  >
  </canvas>
</template>

<style scoped></style>
