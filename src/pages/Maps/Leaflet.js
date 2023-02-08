import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import React from 'react';

const Leaflet = () => (
  <MapContainer center={[51.505, -0.09]} zoom={13}>
    <TileLayer
      attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={[51.505, -0.09]}>
      <Popup>
        <span>
          A pretty CSS3 popup. <br /> Easily customizable.
        </span>
      </Popup>
    </Marker>
  </MapContainer>
);

export default Leaflet;
