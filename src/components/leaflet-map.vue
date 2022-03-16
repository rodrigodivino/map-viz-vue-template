<script lang="ts">
import * as L from "leaflet";
import { defineComponent } from "vue";

export default defineComponent({
  name: "LeafletMap",
  emits: ["move"],

  data() {
    return {
      map: undefined as L.Map | undefined,
      center: [51.505, -0.09] as L.LatLngExpression,
      centerPx: { x: 0, y: 0 } as { x: number; y: number },
    };
  },
  computed: {
    markerPane(): HTMLElement | undefined {
      return this.map?.getPane("markerPane");
    },
  },
  mounted() {
    const center = [51.505, -0.09] as L.LatLngExpression;

    this.map = L.map(this.$refs.map as HTMLElement).setView(
      center,
      13
    ) as L.Map;

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

    this.centerPx = this.map?.latLngToLayerPoint(this.center) ?? {
      x: 0,
      y: 0,
    };

    this.map.on("move", () => {
      this.$emit("move");
      this.centerPx = this.map?.latLngToLayerPoint(this.center) ?? {
        x: 0,
        y: 0,
      };
    });
  },
});
</script>

<template>
  <div id="map" ref="map" class="l-fit" />
  <Teleport v-if="markerPane" :to="map.getPane('markerPane')">
    <div class="marker-pane-wrapper">
      <div
        class="debug-div"
        :style="{
          transform: `translate(${centerPx.x}px,${centerPx.y}px)`,
        }"
      ></div>
    </div>
  </Teleport>
</template>

<style scoped>
.debug-div {
  width: 10px;
  height: 10px;
  background-color: #3777ae;
}

.marker-pane-wrapper {
}
</style>
