import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

import { getOccurrences } from "../services/api";

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export default function Map() {
  const [occurrences, setOccurrences] = useState([]);

  useEffect(() => {
    getOccurrences().then(setOccurrences);
  }, []);

  return (
    <div className="h-125 w-full rounded-xl overflow-hidden">
      <MapContainer
        center={[-23.6205, -45.4132]}
        zoom={13}
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
        />

        {occurrences.map((occ) => (
          <Marker
            key={occ.id}
            position={[Number(occ.latitude), Number(occ.longitude)]} // garante número
          >
            <Popup>
              <strong>{occ.titulo}</strong>
              <p>{occ.descricao}</p>
              <span>Status: {occ.status}</span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}