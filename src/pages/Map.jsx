import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Dados mock
const occurrences = [
  {
    id: 1,
    titulo: "Buraco na rua",
    descricao: "Grande buraco na avenida",
    status: "urgente",
    position: [-23.6205, -45.4132],
  },
  {
    id: 2,
    titulo: "Lixo acumulado",
    descricao: "Muito lixo na calçada",
    status: "em análise",
    position: [-23.622, -45.41],
  },
];

export default function Map() {
  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden">
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
          <Marker key={occ.id} position={occ.position}>
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
