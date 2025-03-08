import { useEffect } from "react";
import maplibregl from "maplibre-gl";
import { useMap } from "./maps-context";
import { MapboxOverlay, MapboxOverlayProps } from "@deck.gl/mapbox";
/**
 * deckgl overlay layer in maplibre
 */
export const DeckGLOverlay = (props: MapboxOverlayProps) => {
  const map = useMap();

  let overlay: maplibregl.IControl;

  /**
   * IDK why like this, because when data changes, deck.gl layer change
   * then we need to modify the controls (where the deck.gl lives). first
   * I copy from react-map-gl implementation, for some reason, it does not
   * work the same with solid.js, so this worksaraund solve my issue.
   *
   * nvm, just remove and add control again
   */
  useEffect(() => {
    if (map?.hasControl(overlay)) map?.removeControl(overlay);

    overlay = new MapboxOverlay(props) as maplibregl.IControl;

    if (!map?.hasControl(overlay)) map?.addControl(overlay);

    return () => {
      map?.removeControl(overlay);
    };
  }, [map, props]);

  return null;
};
