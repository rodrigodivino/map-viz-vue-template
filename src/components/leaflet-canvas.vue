<script lang="ts">
import { CSSProperties, defineComponent, nextTick, PropType } from "vue";

export default defineComponent({
  name: "LeafletCanvas",
  props: {
    origin: {
      type: Object as PropType<{ x: number; y: number } | undefined>,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    zoomAnimStyles: {
      type: Object as PropType<CSSProperties | undefined>,
      required: true,
    },
    reverseZoomAnimScaleStyles: {
      type: Object as PropType<CSSProperties | undefined>,
      required: true,
    },
  },
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
