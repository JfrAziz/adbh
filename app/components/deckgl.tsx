import { useMemo } from "react";
import { bbox } from "@turf/bbox";
import { points } from "@turf/turf";
import { DataPoint, store } from "@/store";
import { useMap } from "@/components/ui/maps-context";
import { DeckGLOverlay } from "@/components/ui/maps-deckgl";
import { ScatterplotLayer, GeoJsonLayer } from "@deck.gl/layers";

/**
 * all layers from deck.gl instance
 */
const DeckGLLayers = () => {
  const map = useMap();

  const active = store((state) => state.active);

  const layers = useMemo(() => {
    const data = store.getState().messages.find((m) => m.id === active)?.data;

    if (!data || !active) return [];

    const result = [];

    /**
     * create scatter plot layer based
     * on the data_points, this can be EV location or something else
     */
    if ("data_points" in data)
      result.push(
        new ScatterplotLayer<DataPoint>({
          id: "scatter",
          data: data.data_points,
          stroked: true,
          pickable: true,
          getPosition: (d) => [d.location.lon, d.location.lat],
          getFillColor: [255, 140, 0, 50],
          getRadius: 500,
          getLineWidth: 1,
          getLineColor: [0, 0, 0, 50],
        })
      );

    /**
     * create polygon layer based on the data_polygon
     */
    if ("data_polygon" in data)
      result.push(
        new GeoJsonLayer({
          id: "polygon",
          data: data["data_polygon"],
          stroked: true,
          filled: true,
          getFillColor: [255, 140, 0, 50],
          getLineColor: [0, 0, 0, 50],
        })
      );

    /**
     * calculate the bounds of the data
     */
    const bounds = (() => {
      /**
       * using the polygon first to calculate the bounds
       */
      if ("data_polygon" in data) return bbox(data.data_polygon!);

      /**
       * if polygon not available, use the data_points
       */
      if ("data_points" in data)
        return bbox(
          points(
            data.data_points!.map((d) => {
              return [d.location.lon, d.location.lat];
            })
          )
        );

      /**
       * fallback to bbox of europe
       */
      return [-10.5, 35.0, 31.5, 71.0];
    })();

    map?.fitBounds(
      [
        [bounds[0], bounds[1]],
        [bounds[2], bounds[3]],
      ],
      {
        duration: 2000,
        padding: 100,
      }
    );

    return result;
  }, [active]);

  return <DeckGLOverlay layers={layers} />;
};

export default DeckGLLayers;
