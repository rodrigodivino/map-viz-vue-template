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
      tl: { x: 0, y: 0 } as { x: number; y: number },
      br: { x: 0, y: 0 } as { x: number; y: number },
    };
  },
  computed: {
    svgPane(): HTMLElement | undefined {
      return this.map?.getPane("svgPane");
    },
    canvasPane(): HTMLElement | undefined {
      return this.map?.getPane("canvasPane");
    },
  },
  watch: {
    tl() {
      nextTick(() => {
        if (!this.$refs.canvasRef) {
          return;
        }
        const ctx = (this.$refs.canvasRef as HTMLCanvasElement).getContext(
          "2d"
        );
        if (!ctx) {
          return;
        }

        ctx.clearRect(0, 0, this.br.x, this.br.y);
        ctx.translate(-this.tl.x, -this.tl.y);
        ctx.fillRect(this.pointInLayer.x, this.pointInLayer.y, 50, 50);
        ctx.resetTransform();
      });
    },
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

    const setCenterPx = () => {
      this.pointInLayer = this.map?.latLngToLayerPoint(this.pointCoords) ?? {
        x: 0,
        y: 0,
      };
    };

    this.map.on("zoomanim", (e) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.pointInLayer = this.map?._latLngToNewLayerPoint(
        this.pointCoords,
        e.zoom,
        e.center
      );

      const centerBounds = new LatLng(...center).toBounds(5000);

      console.log("centerBounds", centerBounds);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.tl = this.map._latLngToNewLayerPoint(
        centerBounds.getNorthWest(),
        e.zoom,
        e.center
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.br = this.map._latLngToNewLayerPoint(
        centerBounds.getSouthEast(),
        e.zoom,
        e.center
      );
    });
    this.map.on("viewreset", () => setCenterPx());
    this.map.on("zoomend", () => {
      setCenterPx();
      const centerBounds = new LatLng(...center).toBounds(5000);
      this.tl = this.map?.latLngToLayerPoint(centerBounds.getNorthWest()) ?? {
        x: 0,
        y: 0,
      };
      this.br = this.map?.latLngToLayerPoint(centerBounds.getSouthEast()) ?? {
        x: 0,
        y: 0,
      };
    });
    setCenterPx();

    const centerBounds = new LatLng(...center).toBounds(5000);
    this.tl = this.map.latLngToLayerPoint(centerBounds.getNorthWest());
    this.br = this.map.latLngToLayerPoint(centerBounds.getSouthEast());

    nextTick(() => {
      const ctx = (this.$refs.canvasRef as HTMLCanvasElement).getContext("2d");
      if (!ctx) {
        return;
      }

      ctx.translate(-this.tl.x, -this.tl.y);
      ctx.fillRect(this.pointInLayer.x, this.pointInLayer.y, 50, 50);
    });
  },
});

//transition: 'transform 0.25s cubic-bezier(0,0,0.25,1)',
</script>

<template>
  <div id="map" ref="map" class="l-fit" />
  <Teleport v-if="svgPane" :to="svgPane">
    <svg
      :style="{
        transform: `translate(${tl.x}px,${tl.y}px)`,
        width: br.x - tl.x + 'px',
        height: br.y - tl.y + 'px',
      }"
    >
      <g class="absolute-coordinates">
        <rect
          :height="br.y - tl.y"
          :width="br.x - tl.x"
          fill="lightgray"
          opacity="0.5"
        ></rect>
      </g>
      <g
        :style="{
          transform: `translate(${-tl.x}px, ${-tl.y}px)`,
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
      :height="br.y - tl.y"
      :style="{ transform: `translate(${tl.x}px,${tl.y}px)` }"
      :width="br.x - tl.x"
    >
    </canvas>
  </Teleport>
</template>

<style scoped></style>
