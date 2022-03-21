<script lang="ts">
import { CSSProperties, defineComponent, nextTick, PropType } from "vue";

export default defineComponent({
  name: "LeafletCanvas",
  props: {
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    zoomAnimStyles: {
      type: Object as PropType<CSSProperties>,
      required: true,
    },
  },

  mounted(): void {
    nextTick(() => {
      console.log("this.$refs.canvasRef", this.$refs.canvasRef);
    });
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
