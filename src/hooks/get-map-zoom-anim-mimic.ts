import { LatLngExpression, Map as LMap, ZoomAnimEvent } from "leaflet";
import { CSSProperties } from "vue";

export const getMapZoomAnimMimic = (
  zoomAnim: ZoomAnimEvent | undefined,
  map: LMap | undefined,
  reference: LatLngExpression
): {
  zoomAnimMimic: CSSProperties;
  zoomAnimMimicScaleInverse: CSSProperties;
} => {
  if (zoomAnim && map) {
    const zoomDiff = zoomAnim.zoom - (map.getZoom() ?? 0);
    const currentProjectedCenter = map.latLngToLayerPoint(reference);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - Function is private
    const soonToBeCenterProjected = map._latLngToNewLayerPoint(
      reference,
      zoomAnim.zoom,
      zoomAnim.center
    );

    console.log("currentProjectedCenter", currentProjectedCenter);
    console.log("soonToBeCenterProjected", soonToBeCenterProjected);
    const diffX = soonToBeCenterProjected.x - currentProjectedCenter.x;
    const diffY = soonToBeCenterProjected.y - currentProjectedCenter.y;
    console.log("diffX", diffX);
    console.log("diffY", diffY);
    console.log("zoomDiff", zoomDiff);
    console.log("'---'", "---");

    return {
      zoomAnimMimic: {
        transform: `translate(${diffX}px, ${diffY}px)`,
        // TODO: see if this can be replaced with leaflet-zoom-anim class at target
        transition: "transform 0.25s cubic-bezier(0,0,0.25,1)",
      },
      zoomAnimMimicScaleInverse: {
        transform: `scale(${1 / 2 ** zoomDiff})`,
        transition: "transform 0.25s",
      },
    };
  } else {
    return {
      zoomAnimMimic: {
        transform: "translate(0,0)",
        transition: "transform 0s",
      },
      zoomAnimMimicScaleInverse: {
        transform: "translate(0,0)",
        transition: "transform 0s",
      },
    };
  }
};
