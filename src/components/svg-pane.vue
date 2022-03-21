<script lang="ts">
import { defineComponent } from "vue";
import MapPaneMixin from "../mixins/map-pane-mixin.vue";

export default defineComponent({
  name: "SVGPane",
  mixins: [MapPaneMixin],
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
      :transform="`translate(${origin.x},${origin.y})`"
      class="projected-coordinates"
    >
      <g class="zoom-anim">
        <slot />
      </g>
    </g>
  </svg>
</template>
