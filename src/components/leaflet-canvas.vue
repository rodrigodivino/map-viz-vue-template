<script lang="ts">
import { defineComponent } from "vue";
import LeafletPaneMixin from "../mixins/leaflet-pane-mixin.vue";

export default defineComponent({
  name: "LeafletCanvas",
  mixins: [LeafletPaneMixin],
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
