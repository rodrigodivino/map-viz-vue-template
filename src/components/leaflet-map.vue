<script lang="ts">
import * as L from "leaflet";
import { LatLng, LatLngBounds } from "leaflet";
import { CSSProperties, defineComponent } from "vue";

export default defineComponent({
  name: "LeafletMap",
  props: {
    center: {
      type: LatLng,
      default: new LatLng(51.505, -0.09),
    },
  },
  emits: {
    viewreset(payload: { map: L.Map }) {
      return !!payload;
    },
  },
  data() {
    return {
      map: undefined as L.Map | undefined,
      currentBounds: undefined as LatLngBounds | undefined,
      nextBounds: undefined as LatLngBounds | undefined,
      nextBoundInPixels: null as
        | [{ x: number; y: number }, { x: number; y: number }]
        | null,
    };
  },
  computed: {
    panes(): { name: string; pane: HTMLElement | undefined }[] {
      return Object.entries(this.map?.getPanes() ?? []).map(
        ([pane, element]) => {
          return {
            name: pane,
            pane: element,
          };
        }
      );
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

    zoomAnimStyles(): CSSProperties {
      if (!this.nextBoundInPixels) {
        return {
          transform: "translate(0,0)scale(1)",
          transition: "transform 0s",
          transformOrigin: "center",
        };
      }

      const newSize = this.nextBoundInPixels[1].x - this.nextBoundInPixels[0].x;
      const oldSize =
        this.currentBoundInPixels[1].x - this.currentBoundInPixels[0].x;
      const scale = newSize / oldSize;

      const currentCenterX =
        this.currentBoundInPixels[0].x +
        0.5 * (this.currentBoundInPixels[1].x - this.currentBoundInPixels[0].x);

      const nextCenterX =
        this.nextBoundInPixels[0].x +
        0.5 * (this.nextBoundInPixels[1].x - this.nextBoundInPixels[0].x);

      const currentCenterY =
        this.currentBoundInPixels[0].y +
        0.5 * (this.currentBoundInPixels[1].y - this.currentBoundInPixels[0].y);
      const nextCenterY =
        this.nextBoundInPixels[0].y +
        0.5 * (this.nextBoundInPixels[1].y - this.nextBoundInPixels[0].y);

      const xTranslation = nextCenterX - currentCenterX;
      const yTranslation = nextCenterY - currentCenterY;

      return {
        transform: `translate(${xTranslation}px,${yTranslation}px)scale(${scale})`,
        transformOrigin: "center center",
        transition: "transform 0.25s cubic-bezier(0,0,0.25,1)",
      };
    },
    reverseZoomAnimScaleStyles(): CSSProperties {
      if (!this.nextBoundInPixels) {
        return {
          transform: "scale(1)",
          transition: "transform 0s",
        };
      }

      const newSize = this.nextBoundInPixels[1].x - this.nextBoundInPixels[0].x;
      const oldSize =
        this.currentBoundInPixels[1].x - this.currentBoundInPixels[0].x;
      const scale = newSize / oldSize;

      return {
        transform: `scale(${1 / scale})`,
        transition: "transform 0.25s cubic-bezier(0,0,0.25,1)",
      };
    },
    currentBoundInPixels(): [
      { x: number; y: number },
      { x: number; y: number }
    ] {
      if (!(this.map && this.currentBounds)) {
        return [
          { x: 0, y: 0 },
          { x: 0, y: 0 },
        ];
      }

      const topLeftPoint = this.map.latLngToLayerPoint(
        this.currentBounds.getNorthWest()
      );
      const bottomRightPoint = this.map.latLngToLayerPoint(
        this.currentBounds.getSouthEast()
      );
      return [topLeftPoint, bottomRightPoint];
    },
  },

  mounted: function () {
    this.map = this.getInitializedMap();

    this.map.on("zoomanim", (e) => this.handleZoomAnim(e));
    this.map.on("viewreset", () => this.handleViewReset());
    this.map.on("zoomend", () => this.handleViewReset());
    this.map.on("move", () => this.handleMapMove());

    this.handleViewReset();
  },
  methods: {
    handleViewReset(): void {
      if (!this.map) {
        return;
      }
      this.nextBoundInPixels = null;
      this.currentBounds = this.map.getBounds().pad(1);
      this.$emit("viewreset", { map: this.map });
    },
    handleMapMove(): void {
      if (!this.map) {
        return;
      }
      if (!this.currentBounds?.contains(this.map.getBounds())) {
        this.handleViewReset();
      }
    },
    handleZoomAnim(e: L.ZoomAnimEvent): void {
      if (!(this.map && this.currentBounds)) {
        return;
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const topLeftPoint = this.map._latLngToNewLayerPoint(
        this.currentBounds.getNorthWest(),
        e.zoom,
        e.center
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const bottomRightPoint = this.map._latLngToNewLayerPoint(
        this.currentBounds.getSouthEast(),
        e.zoom,
        e.center
      );

      this.nextBoundInPixels = [topLeftPoint, bottomRightPoint].map((p) => ({
        x: Math.round(p.x),
        y: Math.round(p.y),
      })) as [{ x: number; y: number }, { x: number; y: number }];
    },

    getInitializedMap(): L.Map {
      const map = L.map(this.$refs.map as HTMLElement).setView(
        this.$props.center,
        13
      );

      new Array(5)
        .fill(0)
        .map((d, i) => "pane" + (i + 1))
        .forEach((pane, i) => {
          map.createPane(pane).style.zIndex = `${601 + i}`;
        });

      map.createPane("labelsPane").style.zIndex = "850";

      new Array(5)
        .fill(0)
        .map((d, i) => "foregroundPane" + (i + 1))
        .forEach((pane, i) => {
          map.createPane(pane).style.zIndex = `${851 + i}`;
        });

      L.tileLayer(
        "https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}",
        {
          attribution:
            'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          subdomains: "abcd",
          minZoom: 12,
          maxZoom: 160,
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
          maxZoom: 160,
          pane: "labelsPane",
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          ext: "png",
        }
      ).addTo(map);

      L.control.scale().addTo(map);

      return map;
    },
  },
});
</script>

<template>
  <div id="map" ref="map" class="l-fit" />
  <template v-for="paneDefinition in panes">
    <Teleport
      v-if="paneDefinition.pane"
      :key="paneDefinition.name"
      :to="paneDefinition.pane"
    >
      <div
        :style="{
          transform: `translate(${currentBoundInPixels[0].x}px,${currentBoundInPixels[0].y}px)`,
          width: currentBoundSizeInPixels.width + 'px',
          height: currentBoundSizeInPixels.height + 'px',
        }"
      >
        <slot
          :height="currentBoundSizeInPixels.height"
          :name="paneDefinition.name"
          :origin="{
            x: -currentBoundInPixels[0].x,
            y: -currentBoundInPixels[0].y,
          }"
          :reverse-zoom-anim-scale-styles="reverseZoomAnimScaleStyles"
          :width="currentBoundSizeInPixels.width"
          :zoom-anim-styles="zoomAnimStyles"
        >
        </slot>
      </div>
    </Teleport>
  </template>
</template>

<style scoped></style>
