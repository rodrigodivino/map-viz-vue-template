<script lang="ts">
import { CSSProperties, defineComponent, PropType } from "vue";

export default defineComponent({
  name: "LeafletPaneMixin",
  props: {
    origin: {
      type: Object as PropType<{ x: number; y: number } | undefined>,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    zoomAnimStyles: {
      type: Object as PropType<CSSProperties | undefined>,
      required: true,
    },
    reverseZoomAnimScaleStyles: {
      type: Object as PropType<CSSProperties | undefined>,
      required: true,
    },
  },
});
</script>
