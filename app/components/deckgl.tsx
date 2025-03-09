import { useMemo } from "react";
import { bbox } from "@turf/bbox";
import { points } from "@turf/turf";
import { DataPoint, store } from "@/store";
import { useMap } from "@/components/ui/maps-context";
import { DeckGLOverlay } from "@/components/ui/maps-deckgl";
import { ScatterplotLayer, GeoJsonLayer, GridCellLayer } from "@deck.gl/layers";

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
    if (data.map?.points) {
      const colorSchema: Record<
        Exclude<DataPoint["type"], "News">,
        [number, number, number, number]
      > = {
        EVChargingStation: [253, 231, 37, 100],
        GreeneryLand: [40, 174, 128, 255],
        WasteRecycleFacility: [173, 220, 48, 100],
      };

      result.push(
        new ScatterplotLayer<DataPoint>({
          id: "scatter",
          data: data.map?.points || [],
          stroked: true,
          pickable: true,
          getPosition: (d) => [d.location.lon, d.location.lat],
          getLineColor: [255, 255, 255, 20],
          getRadius: 250,
          getLineWidth: 100,
          getFillColor: (d) => colorSchema[d.type as keyof typeof colorSchema],
        })
      );
    }

    if (data.map?.grids)
      result.push(
        new GridCellLayer<DataPoint>({
          id: "grid",
          extruded: false,
          data: data.map?.grids || [],
          pickable: true,
          getPosition: (d) => [d.location.lat, d.location.lon],
          cellSize: 1200,
          getFillColor: [253, 231, 37, 255],
        })
      );

    /**
     * create polygon layer based on the data_polygon
     */
    if (data.map?.polygon)
      result.push(
        new GeoJsonLayer({
          id: "polygon",
          data: data.map?.polygon,
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
       * use points first to calculate the bounds
       */
      if (data.map?.points)
        return bbox(
          points(
            data.map!.points!.map((d) => {
              return [d.location.lon, d.location.lat];
            })
          )
        );

      /**
       * then using grids if points not exist
       */
      if (data.map?.grids)
        return bbox(
          points(
            data.map!.grids!.map((d) => {
              return [d.location.lat, d.location.lon];
            })
          )
        );

      /**
       * then using polygon if grids not exist
       */
      if (data.map?.polygon) return bbox(data.map?.polygon!);

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
