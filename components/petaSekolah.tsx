"use client"
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })

// Fix default icon agar marker muncul di Next.js
const createIcon = () => {
  const L = require('leaflet')
  return L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: 'leaflet-marker-red',
  })
}

export default function PetaSekolah({ lat = -6.2, lng = 106.816666, alamat = "" }: { lat?: number, lng?: number, alamat?: string }) {
  return (
    <div className="w-full h-72 rounded-2xl overflow-hidden shadow-lg relative">
      <MapContainer center={[lat, lng]} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} icon={createIcon()}>
          {alamat && <Popup>{alamat}</Popup>}
        </Marker>
      </MapContainer>
      {/* Pulse animasi di atas marker (absolute, pointer-events-none) */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[calc(50%+20px)] z-[999]">
        <span className="block w-10 h-10 rounded-full bg-primary/30 animate-ping"></span>
      </div>
    </div>
  )
}
