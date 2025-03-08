import { MapInstance, DeckGLOverlay } from "@/components/ui/maps";

/**
 * all layers from deck.gl instance
 */
const Layers = () => {
  // const layers = useQuery({
  //   ...mpdQuery,
  //   select: (data) => {
  //     const h3 = new H3HexagonLayer<(typeof data)[number]>({
  //       id: "h3",
  //       data: data,
  //       pickable: true,
  //       extruded: false,
  //       getFillColor: () => [135, 206, 235, 100],
  //       getHexagon: (d) => d.h3Index,
  //     });

  //     const scatter = new ScatterplotLayer<(typeof data)[number]>({
  //       id: "scatter",
  //       data: data,
  //       stroked: true,
  //       pickable: true,
  //       getPosition: (d) => [Number(d.longitude), Number(d.latitude)],
  //       getFillColor: [255, 140, 0, 50],
  //       getRadius: 25,
  //       getLineWidth: 1,
  //       getLineColor: [0, 0, 0, 50],
  //     });

  //     return [h3, scatter];
  //   },
  // });

  return <DeckGLOverlay layers={[]} />;
};

export const Maps = () => {
  return (
    <>
      <MapInstance
        attributionControl={false}
        className="absolute top-0 left-0 size-full"
        mapStyle="https://maps.datawan.id/styles/black.json"
        mapView={{ center: [5.19272, 45.6345], zoom: 5 }}
      />
      <Layers />
    </>
  );
};
