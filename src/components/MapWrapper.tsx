'use client'

import dynamic from 'next/dynamic'

const MapComponent = dynamic(() => import('./Map'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-gray-100 flex items-center justify-center">Loading Map...</div>
})

import { VillageWithProducts } from '@/types'

export default function MapWrapper({ villages }: { villages: VillageWithProducts[] }) {
    return <MapComponent villages={villages} />
}
