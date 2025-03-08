import { MapInstance } from "@/components/ui/maps-instance";

const Maps = () => {
  return (
    <MapInstance
      attributionControl={false}
      className="absolute top-0 left-0 size-full"
      mapStyle="https://maps.datawan.id/styles/black.json"
      mapView={{ center: [5.19272, 45.6345], zoom: 5 }}
    />
  );
};

export default Maps;
