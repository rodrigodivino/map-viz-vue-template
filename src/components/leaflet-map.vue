<script lang="ts">
import * as L from "leaflet";
import { LatLng } from "leaflet";
import { defineComponent, nextTick } from "vue";
import { geoMercator, GeoProjection } from "d3";

export default defineComponent({
  name: "LeafletMap",
  emits: {
    viewreset() {
      return true;
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    zoomanim(payload: L.ZoomAnimEvent) {
      return true;
    },
  },

  data() {
    return {
      map: undefined as L.Map | undefined,
      pointCoords: [51.505, -0.09] as L.LatLngExpression,
      pointInLayer: { x: 0, y: 0 } as { x: number; y: number },
      projection: geoMercator() as GeoProjection,
      currentBoundInPixels: [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ] as [{ x: number; y: number }, { x: number; y: number }],
      nextBoundInPixels: [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ] as [{ x: number; y: number }, { x: number; y: number }],
    };
  },
  computed: {
    svgPane(): HTMLElement | undefined {
      return this.map?.getPane("svgPane");
    },
    canvasPane(): HTMLElement | undefined {
      return this.map?.getPane("canvasPane");
    },
    currentBoundSizeInPixels(): { width: number; height: number } {
      const width =
        this.currentBoundInPixels[1].x - this.currentBoundInPixels[0].x;

      const height =
        this.currentBoundInPixels[1].y - this.currentBoundInPixels[0].y;

      return {
        width,
        height,
      };
    },
  },
  watch: {
    currentBoundInPixels() {
      if (!this.map) {
        return;
      }
      console.log("currentBoundInPixels changed");
      console.log("this.currentBoundInPixels", this.currentBoundInPixels);

      this.pointInLayer = this.map.latLngToLayerPoint(this.pointCoords);
    },
    nextBoundInPixels() {
      console.log("nextBoundInPixels changed");
    },
    // tl() {
    //   nextTick(() => {
    //     if (!this.$refs.canvasRef) {
    //       return;
    //     }
    //     const ctx = (this.$refs.canvasRef as HTMLCanvasElement).getContext(
    //       "2d"
    //     );
    //     if (!ctx) {
    //       return;
    //     }
    //
    //     ctx.clearRect(0, 0, this.br.x, this.br.y);
    //     ctx.translate(-this.tl.x, -this.tl.y);
    //     ctx.fillRect(this.pointInLayer.x, this.pointInLayer.y, 50, 50);
    //     ctx.resetTransform();
    //   });
    // },
  },

  mounted() {
    const center = [51.505, -0.09] as L.LatLngTuple;

    this.map = L.map(this.$refs.map as HTMLElement).setView(
      center,
      13
    ) as L.Map;

    this.map.createPane("canvasPane").style.zIndex = "601";
    this.map.createPane("svgPane").style.zIndex = "602";
    this.map.createPane("labelPane").style.zIndex = "850";

    L.tileLayer(
      "https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}",
      {
        attribution:
          'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: "abcd",
        minZoom: 12,
        maxZoom: 16,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ext: "png",
      }
    ).addTo(this.map as L.Map);

    L.tileLayer(
      "https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.{ext}",
      {
        attribution:
          'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: "abcd",
        minZoom: 12,
        maxZoom: 16,
        pane: "labelPane",
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ext: "png",
      }
    ).addTo(this.map as L.Map);

    L.control.scale().addTo(this.map as L.Map);

    this.map.on("zoomanim", (e) => this.updateNextBounds(e));
    this.map.on("viewreset", () => this.updateCurrentBounds());
    this.map.on("zoomend", () => this.updateCurrentBounds());

    this.updateCurrentBounds();

    nextTick(() => {
      const ctx = (this.$refs.canvasRef as HTMLCanvasElement).getContext("2d");
      if (!ctx) {
        return;
      }

      ctx.translate(
        -this.currentBoundInPixels[0].x,
        -this.currentBoundInPixels[0].y
      );
      ctx.fillRect(this.pointInLayer.x, this.pointInLayer.y, 50, 50);
    });
  },
  methods: {
    updateCurrentBounds(): void {
      if (!this.map) {
        return;
      }

      const center = [51.505, -0.09] as L.LatLngTuple;

      const currentBounds = new LatLng(...center).toBounds(5000);
      const topLeftPoint = this.map.latLngToLayerPoint(
        currentBounds.getNorthWest()
      );
      const bottomRightPoint = this.map.latLngToLayerPoint(
        currentBounds.getSouthEast()
      );
      this.currentBoundInPixels = [topLeftPoint, bottomRightPoint];
    },
    updateNextBounds(e: L.ZoomAnimEvent): void {
      if (!this.map) return;

      const center = [51.505, -0.09] as L.LatLngTuple;

      const currentBounds = new LatLng(...center).toBounds(5000);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const topLeftPoint = this.map._latLngToNewLayerPoint(
        currentBounds.getNorthWest(),
        e.zoom,
        e.center
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const bottomRightPoint = this.map._latLngToNewLayerPoint(
        currentBounds.getSouthEast(),
        e.zoom,
        e.center
      );
      this.nextBoundInPixels = [topLeftPoint, bottomRightPoint];
    },
  },
});

//transition: 'transform 0.25s cubic-bezier(0,0,0.25,1)',
</script>

<template>
  <div id="map" ref="map" class="l-fit" />
  <Teleport v-if="svgPane" :to="svgPane">
    <svg
      :style="{
        transform: `translate(${currentBoundInPixels[0].x}px,${currentBoundInPixels[0].y}px)`,
        width: currentBoundSizeInPixels.width + 'px',
        height: currentBoundSizeInPixels.height + 'px',
      }"
    >
      <g class="absolute-coordinates">
        <rect
          :height="currentBoundSizeInPixels.height"
          :width="currentBoundSizeInPixels.width"
          fill="lightgray"
          opacity="0.5"
        ></rect>
      </g>
      <g
        :style="{
          transform: `translate(${-currentBoundInPixels[0]
            .x}px,${-currentBoundInPixels[0].y}px)`,
        }"
        class="projected-coordinates"
      >
        <g
          :style="{
            transform: `translate(${pointInLayer.x}px,${pointInLayer.y}px)`,
            // transition: 'transform 0.25s cubic-bezier(0,0,0.25,1)',
            // transformOrigin: 'top left',
          }"
        >
          <text>Text Placeholder</text>
          <circle r="10"></circle>
        </g>
      </g>
    </svg>
  </Teleport>
  <Teleport v-if="canvasPane" :to="canvasPane">
    <canvas
      ref="canvasRef"
      :height="currentBoundSizeInPixels.height"
      :style="{
        transform: `translate(${currentBoundInPixels[0].x}px,${currentBoundInPixels[0].y}px)`,
      }"
      :width="currentBoundSizeInPixels.width"
    >
    </canvas>
  </Teleport>
</template>

<style scoped></style>
