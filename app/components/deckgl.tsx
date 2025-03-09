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
    if ("data_points" in data) {
      const colorSchema: Record<
        DataPoint["type"],
        [number, number, number, number]
      > = {
        EVChargingStation: [253, 231, 37, 255],
        GreeneryLand: [40, 174, 128, 255],
        WasteRecycleFacility: [173, 220, 48, 255],
      };

      result.push(
        new ScatterplotLayer<DataPoint>({
          id: "scatter",
          data: data.data_points,
          stroked: true,
          pickable: true,
          getPosition: (d) => [d.location.lon, d.location.lat],
          getLineColor: [253, 231, 37, 50],
          getRadius: 250,
          getLineWidth: 10,
          getFillColor:
            colorSchema[data.data_points?.[0].type || "GreeneryLand"],
        })
      );
    }

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
          getFillColor: [62, 42, 113, 50],
          getLineColor: [51, 146, 247, 50],
          getLineWidth: 100,
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
