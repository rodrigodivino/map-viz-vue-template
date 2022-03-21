<script lang="ts">
import LeafletMap from "./leaflet-map.vue";
import { defineComponent, nextTick } from "vue";
import * as L from "leaflet";
import { LatLng } from "leaflet";
import CanvasPane, { CanvasDef } from "./canvas-pane.vue";
import SVGPane from "./svg-pane.vue";

export default defineComponent({
  name: "ApplicationRoot",
  components: { SVGPane, CanvasPane, LeafletMap },
  data() {
    return {
      pointInLayer: { x: 0, y: 0 } as { x: number; y: number },
      firstCanvas: undefined as CanvasDef | undefined,
      secondCanvas: undefined as CanvasDef | undefined,
    };
  },
  methods: {
    handleMapViewReset(payload: { map: L.Map }): void {
      this.pointInLayer = payload.map.latLngToLayerPoint(
        new LatLng(51.505, -0.09)
      );

      nextTick(() => {
        this.renderFirstCanvas();
        this.renderSecondCanvas();
      });
    },

    handleFirstCanvasReady(payload: CanvasDef): void {
      this.firstCanvas = payload;
    },

    handleSecondCanvasReady(payload: CanvasDef): void {
      this.secondCanvas = payload;
    },

    // TODO: Create component to serve as template for canvas rendering with props.
    // TODO: Create a "templates" folder with unused components to be copied and edited.
    renderFirstCanvas() {
      if (
        !(this.firstCanvas && this.firstCanvas.canvas && this.firstCanvas.ctx)
      )
        return;

      this.firstCanvas?.clear();
      this.firstCanvas.ctx.fillRect(
        this.pointInLayer.x - 20,
        this.pointInLayer.y - 20,
        20,
        20
      );
    },
    renderSecondCanvas() {
      if (
        !(
          this.secondCanvas &&
          this.secondCanvas.canvas &&
          this.secondCanvas.ctx
        )
      )
        return;

      this.secondCanvas?.clear();
      this.secondCanvas.ctx.fillRect(
        this.pointInLayer.x,
        this.pointInLayer.y,
        20,
        20
      );
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
      <LeafletMap @viewreset="handleMapViewReset">
        <template #pane1="props">
          <CanvasPane
            :height="props.height"
            :origin="props.origin"
            :reverse-zoom-anim-scale-styles="props.reverseZoomAnimScaleStyles"
            :width="props.width"
            :zoom-anim-styles="props.zoomAnimStyles"
            @canvas-ready="handleFirstCanvasReady"
          />
        </template>

        <template #pane2="props">
          <SVGPane
            :height="props.height"
            :origin="props.origin"
            :reverse-zoom-anim-scale-styles="props.reverseZoomAnimScaleStyles"
            :width="props.width"
            :zoom-anim-styles="props.zoomAnimStyles"
          >
            <g :transform="`translate(${pointInLayer.x},${pointInLayer.y})`">
              <g :style="props.reverseZoomAnimScaleStyles">
                <circle fill="red" r="10"></circle>
              </g>
            </g>
          </SVGPane>
        </template>

        <template #foregroundPane1="props">
          <SVGPane
            :height="props.height"
            :origin="props.origin"
            :reverse-zoom-anim-scale-styles="props.reverseZoomAnimScaleStyles"
            :width="props.width"
            :zoom-anim-styles="props.zoomAnimStyles"
          >
            <g :transform="`translate(${pointInLayer.x},${pointInLayer.y})`">
              <g :style="props.reverseZoomAnimScaleStyles">
                <text>Text Placeholder</text>
              </g>
            </g>
          </SVGPane>
        </template>

        <template #foregroundPane2="props">
          <CanvasPane
            :height="props.height"
            :origin="props.origin"
            :reverse-zoom-anim-scale-styles="props.reverseZoomAnimScaleStyles"
            :width="props.width"
            :zoom-anim-styles="props.zoomAnimStyles"
            @canvas-ready="handleSecondCanvasReady"
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
