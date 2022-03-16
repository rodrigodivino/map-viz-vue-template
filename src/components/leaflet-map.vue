<script lang="ts">
import * as L from "leaflet";
import { defineComponent } from "vue";

declare interface LeafletMapState {
  map?: L.Map;
  markerPane?: HTMLElement;
}

export default defineComponent<{}, LeafletMapState>({
  name: "LeafletMap",

  data(): LeafletMapState {
    return {
      map: undefined,
      markerPane: undefined,
    };
  },
  mounted() {
    this.map = L.map(this.$refs.map as HTMLElement).setView(
      [51.505, -0.09],
      13
    ) as L.Map;

    this.map.createPane("labelPane").style.zIndex = "850";

    this.markerPane = this.map.getPane("markerPane");

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
    ).addTo(this.map);

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
    ).addTo(this.map);

    L.control.scale().addTo(this.map);

    console.log(
      "this.map.getPane('markerPane')",
      this.map.getPane("markerPane")
    );
  },
});
</script>

<template>
  <div id="map" ref="map" class="l-fit" />
  <Teleport v-if="markerPane" :to="map.getPane('markerPane')">
    <span>Hello World</span>
  </Teleport>
</template>

<style scoped></style>
