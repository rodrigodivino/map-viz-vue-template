<script lang="ts">
import { defineComponent } from "vue";
import LeafletPane from "./leaflet-pane.vue";

export default defineComponent({
  name: "LeafletCanvas",
  mixins: [LeafletPane],
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
  <slot :canvas="$refs.canvasRef"></slot>
</template>

<style scoped></style>
