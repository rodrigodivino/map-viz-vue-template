<script lang="ts">
import { defineComponent, nextTick } from "vue";
import MapPaneMixin from "../mixins/map-pane-mixin.vue";

export interface CanvasDef {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  clear: () => void;
}

export default defineComponent({
  name: "CanvasPane",
  mixins: [MapPaneMixin],
  emits: {
    canvasReady(payload: CanvasDef) {
      return !!payload;
    },
  },

  mounted(): void {
    const canvas = this.$refs.canvasRef as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    this.$emit("canvasReady", {
      canvas,
      ctx,
      clear: () => {
        if (!ctx) return;
        ctx.resetTransform();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(this.origin?.x ?? 0, this.origin?.y ?? 0);
      },
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
</template>

<style scoped></style>
