<script lang="ts">
import { defineComponent } from "vue";
import LeafletPaneMixin from "../mixins/leaflet-pane-mixin.vue";

export default defineComponent({
  name: "LeafletSVG",
  mixins: [LeafletPaneMixin],
});
</script>

<template>
  <svg
    :style="[
      {
        width: '100%',
        height: '100%',
      },
      zoomAnimStyles,
    ]"
  >
    <g
      :style="{
        transform: `translate(${-origin[0].x}px,${-origin[0].y}px)`,
      }"
      class="projected-coordinates"
    >
      <g class="zoom-anim">
        <slot />
      </g>
    </g>
  </svg>
</template>
