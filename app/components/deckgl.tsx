import { useMemo } from "react";
import { bbox } from "@turf/bbox";
import { points } from "@turf/turf";
import { DataPoint, store } from "@/store";
import { scaleSequential } from "d3-scale";
import { interpolateReds } from "d3-scale-chromatic";
import { useMap } from "@/components/ui/maps-context";
import { DeckGLOverlay } from "@/components/ui/maps-deckgl";
import { ScatterplotLayer, GeoJsonLayer, GridCellLayer } from "@deck.gl/layers";

const viridis = scaleSequential(interpolateReds);

/**
 * transform color string to rgb value array, for example
 * rgb(0, 0, 0) or #123456 to [0, 0, 0]. we don't do much validation
 * because we know every value that use this function is valid,
 * is either rgb(0,0,0) or hex
 */
const transformToRGBArray = (color: string): [number, number, number] => {
  if (color.startsWith("rgb"))
    return color
      .replace("rgb(", "")
      .replace(")", "")
      .split(",")
      .map((x) => Number(x.trim())) as [number, number, number];

  const hex = color.slice(1);

  const r = parseInt(hex.slice(0, 2), 16);

  const g = parseInt(hex.slice(2, 4), 16);

  const b = parseInt(hex.slice(4, 6), 16);

  return [r, g, b];
};

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
          data: data.map?.points || [],
          stroked: true,
          pickable: true,
          getPosition: (d) => [d.location.lon, d.location.lat],
          getLineColor: [255, 255, 255, 20],
          getRadius: 250,
          getLineWidth: 100,
          getFillColor: (d) => colorSchema[d.type],
        })
      );
    }

    if (data.map?.grids) {
      const sortedData = [...(data.map?.grids || [])].sort((a, b) => {
        return a!.value! - b!.value!;
      });

      result.push(
        new GridCellLayer<DataPoint>({
          id: "grid",
          extruded: false,
          data: data.map?.grids || [],
          pickable: true,
          getPosition: (d) => [d.location.lat, d.location.lon],
          cellSize: 1200,
          getFillColor: (data) => {
            const idx = sortedData.findIndex((d) => d.value === data.value);

            const color = transformToRGBArray(
              viridis((1 / sortedData.length) * (idx + 1))
            );

            return [...color, 100];
          },
        })
      );
    }

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
