'use client'

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import L from 'leaflet'
import StockPanel from './StockPanel'
import { addVillage } from '@/app/actions'
import { Plus } from 'lucide-react'
import { VillageWithProducts } from '@/types'

// Fix default icon issue in Next.js
const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
})

function MapEvents({ isAdding, onLocationSelect }: { isAdding: boolean, onLocationSelect: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            if (isAdding) {
                onLocationSelect(e.latlng.lat, e.latlng.lng)
            }
        },
    })
    return null
}

export default function Map({ villages }: { villages: VillageWithProducts[] }) {
    const [isMounted, setIsMounted] = useState(false)
    const [selectedVillage, setSelectedVillage] = useState<VillageWithProducts | null>(null)
    const [isAddingVillage, setIsAddingVillage] = useState(false)
    const [newVillageLoc, setNewVillageLoc] = useState<{ lat: number, lng: number } | null>(null)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return <div className="h-full w-full bg-gray-100 flex items-center justify-center">Loading Map...</div>
    }

    const handleLocationSelect = (lat: number, lng: number) => {
        setNewVillageLoc({ lat, lng })
    }

    return (
        <div className="relative h-full w-full">
            <MapContainer
                center={[-6.59, 110.68]}
                zoom={11}
                style={{ height: '100%', width: '100%' }}
                // @ts-ignore
                className={isAddingVillage ? 'cursor-crosshair' : ''}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapEvents isAdding={isAddingVillage} onLocationSelect={handleLocationSelect} />

                {villages.map((v) => (
                    <Marker
                        key={v.id}
                        position={[v.latitude, v.longitude]}
                        icon={defaultIcon}
                    >
                        <Popup>
                            <div className="min-w-[150px]">
                                <h3 className="font-bold text-lg mb-2">{v.name}</h3>
                                <p className="text-sm text-gray-600 mb-2">{v.products?.length || 0} Products</p>
                                <button
                                    onClick={() => setSelectedVillage(v)}
                                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm w-full hover:bg-blue-700 transition"
                                >
                                    Manage Stock
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {newVillageLoc && (
                    <Popup
                        position={[newVillageLoc.lat, newVillageLoc.lng]}
                        eventHandlers={{
                            remove: () => setNewVillageLoc(null)
                        }}
                    >
                        <div className="p-2">
                            <h3 className="font-bold mb-2">Add New Village</h3>
                            <form action={async (formData) => {
                                await addVillage(formData)
                                setNewVillageLoc(null)
                                setIsAddingVillage(false)
                            }}>
                                <input type="hidden" name="latitude" value={newVillageLoc.lat} />
                                <input type="hidden" name="longitude" value={newVillageLoc.lng} />
                                <input name="name" placeholder="Village Name" className="border p-1 rounded w-full mb-2" required autoFocus />
                                <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded text-sm w-full">Save Location</button>
                            </form>
                        </div>
                    </Popup>
                )}
            </MapContainer>

            {/* Floating Action Button */}
            <button
                onClick={() => {
                    setIsAddingVillage(!isAddingVillage)
                    setNewVillageLoc(null)
                }}
                className={`fixed bottom-8 right-8 z-[1000] shadow-2xl transition-all duration-300 ${isAddingVillage ? 'bg-red-500 hover:bg-red-600 rotate-45' : 'bg-blue-600 hover:bg-blue-700'} p-4 rounded-full text-white`}
                title="Add Village"
            >
                <Plus size={32} />
            </button>

            {isAddingVillage && (
                <div className="fixed bottom-24 right-8 bg-black/75 text-white px-4 py-2 rounded-lg backdrop-blur-sm pointer-events-none z-[1000] animate-in fade-in slide-in-from-bottom-2">
                    Click on the map to add a village
                </div>
            )}

            {selectedVillage && (
                <StockPanel village={selectedVillage} onClose={() => setSelectedVillage(null)} />
            )}
        </div>
    )
}
