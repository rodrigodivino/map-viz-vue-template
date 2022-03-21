<script lang="ts">
import * as L from "leaflet";
import { LatLng } from "leaflet";
import { defineComponent, nextTick } from "vue";

export default defineComponent({
  name: "LeafletMap",
  props: {
    center: {
      type: LatLng,
      default: new LatLng(51.505, -0.09),
    },
  },
  data() {
    return {
      map: undefined as L.Map | undefined,
      pointInLayer: { x: 0, y: 0 } as { x: number; y: number },
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

  // TODO: Use nextBoundInPixels change to trigger zoom animations for meshes and points
  // TODO: Find the transform CSS that maps a currentBoundInPixels to nextBoundInPixels, including scale (will work for meshes)
  // TODO: Find the inverse scale CSS to apply to elements that don't want to scale on zoom anim (to improve points)

  mounted: function () {
    this.map = this.getInitializedMap();

    this.map.on("zoomanim", (e) => this.handleZoomAnim(e));
    this.map.on("viewreset", () => this.handleViewUpdate());
    this.map.on("zoomend", () => this.handleViewUpdate());

    this.handleViewUpdate();
  },
  methods: {
    renderCanvas(): void {
      if (!this.$refs.canvasRef) {
        return;
      }

      const ctx = (this.$refs.canvasRef as HTMLCanvasElement).getContext("2d");

      if (!ctx) {
        return;
      }

      ctx.clearRect(
        0,
        0,
        this.currentBoundSizeInPixels.width,
        this.currentBoundSizeInPixels.height
      );
      ctx.translate(
        -this.currentBoundInPixels[0].x,
        -this.currentBoundInPixels[0].y
      );
      ctx.fillRect(this.pointInLayer.x, this.pointInLayer.y, 50, 50);
      ctx.resetTransform();
    },
    handleViewUpdate(): void {
      this.encodeCurrentBoundInPixels();
      this.encode();
      this.render();
    },
    handleZoomAnim(e: L.ZoomAnimEvent): void {
      this.updateNextBounds(e);
    },

    getInitializedMap(): L.Map {
      const map = L.map(this.$refs.map as HTMLElement).setView(
        this.$props.center,
        13
      );

      map.createPane("canvasPane").style.zIndex = "601";
      map.createPane("svgPane").style.zIndex = "602";
      map.createPane("labelsPane").style.zIndex = "850";

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
      ).addTo(map);

      L.tileLayer(
        "https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.{ext}",
        {
          attribution:
            'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          subdomains: "abcd",
          minZoom: 12,
          maxZoom: 16,
          pane: "labelsPane",
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          ext: "png",
        }
      ).addTo(map);

      L.control.scale().addTo(map);

      return map;
    },

    updateNextBounds(e: L.ZoomAnimEvent): void {
      if (!this.map) {
        return;
      }

      const currentBounds = this.$props.center.toBounds(5000);
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

    encodePointInLayer(): { x: number; y: number } {
      return this.map?.latLngToLayerPoint(this.$props.center) ?? { x: 0, y: 0 };
    },
    encodeCurrentBoundInPixels(): [
      { x: number; y: number },
      { x: number; y: number }
    ] {
      if (!this.map) {
        return [
          { x: 0, y: 0 },
          { x: 0, y: 0 },
        ];
      }

      const currentBounds = this.$props.center.toBounds(5000);
      const topLeftPoint = this.map.latLngToLayerPoint(
        currentBounds.getNorthWest()
      );
      const bottomRightPoint = this.map.latLngToLayerPoint(
        currentBounds.getSouthEast()
      );
      return [topLeftPoint, bottomRightPoint];
    },

    encode(): void {
      if (!this.map) {
        return;
      }
      this.currentBoundInPixels = this.encodeCurrentBoundInPixels();

      this.pointInLayer = this.encodePointInLayer();
    },

    render(): void {
      nextTick(() => {
        this.renderCanvas();
      });
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
