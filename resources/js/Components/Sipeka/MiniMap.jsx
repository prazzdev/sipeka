import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function MiniMap({ lat, lng }) {
    // Pastikan koordinat adalah angka (float)
    const position = [parseFloat(lat), parseFloat(lng)];

    return (
        <div className="w-full h-full min-h-[300px] rounded-xl overflow-hidden shadow-inner border border-gray-200">
            <MapContainer 
                center={position} 
                zoom={15} 
                style={{ height: '300px', width: '100%' }}
                scrollWheelZoom={false}
            >
                <TileLayer 
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <Marker position={position} />
            </MapContainer>
        </div>
    );
}