<script lang="ts">
import LeafletMap from "./leaflet-map.vue";
import { defineComponent } from "vue";
import * as L from "leaflet";
import { LatLng } from "leaflet";
import LeafletCanvas from "./leaflet-canvas.vue";

export default defineComponent({
  name: "ApplicationRoot",
  components: { LeafletCanvas, LeafletMap },
  data() {
    return {
      pointInLayer: { x: 0, y: 0 } as { x: number; y: number },
      canvas: undefined as HTMLCanvasElement | undefined,
      canvasForeground: undefined as HTMLCanvasElement | undefined,
    };
  },
  methods: {
    handleMapViewReset(payload: { map: L.Map }): void {
      this.pointInLayer = payload.map.latLngToLayerPoint(
        new LatLng(51.505, -0.09)
      );
    },

    handleCanvasReady(payload: {
      canvas: HTMLCanvasElement;
      canvasForeground: HTMLCanvasElement;
    }): void {
      this.canvas = payload.canvas;
      this.canvasForeground = payload.canvasForeground;
    },
  },
});
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
      <LeafletMap
        @viewreset="handleMapViewReset"
        @canvas-ready="handleCanvasReady"
      >
        <template #svg="projectedSVGProps">
          <g :transform="`translate(${pointInLayer.x},${pointInLayer.y})`">
            <g :style="projectedSVGProps.reverseZoomAnimScaleStyles">
              <circle fill="red" r="10"></circle>
            </g>
          </g>
        </template>

        <template #svg-foreground="projectedSVGProps">
          <g :transform="`translate(${pointInLayer.x},${pointInLayer.y})`">
            <g :style="projectedSVGProps.reverseZoomAnimScaleStyles">
              <text>Text Placeholder</text>
            </g>
          </g>
        </template>

        <template #canvas="props">
          <LeafletCanvas
            :height="props.height"
            :origin="props.origin"
            :reverse-zoom-anim-scale-styles="props.reverseZoomAnimScaleStyles"
            :width="props.width"
            :zoom-anim-styles="props.zoomAnimStyles"
          />
        </template>

        <template #canvas-foreground="props">
          <LeafletCanvas
            :height="props.height"
            :origin="props.origin"
            :reverse-zoom-anim-scale-styles="props.reverseZoomAnimScaleStyles"
            :width="props.width"
            :zoom-anim-styles="props.zoomAnimStyles"
          />
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
