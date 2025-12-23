import { prisma } from '@/lib/prisma'
import MapWrapper from '@/components/MapWrapper'
import { VillageWithProducts } from '@/types'

export default async function Home() {
  const villages = await prisma.village.findMany({
    include: {
      products: true
    }
  })

  return (
    <main className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar / Overlay */}
      <div className="absolute top-4 left-4 z-[1000] bg-white p-4 rounded-xl shadow-2xl w-80 max-h-[90vh] overflow-y-auto hidden md:block border border-gray-200">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-4">
          Mebel Jepara GIS
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Interactive stock management system for Jepara furniture villages.
        </p>

        <div className="space-y-3">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-semibold text-blue-800">Total Villages</h3>
            <p className="text-2xl font-bold text-blue-600">{villages.length}</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
            <h3 className="font-semibold text-emerald-800">Total Products</h3>
            <p className="text-2xl font-bold text-emerald-600">
              {villages.reduce((acc: number, v: VillageWithProducts) => acc + (v.products.length || 0), 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Main Map Area */}
      <div className="flex-1 h-full relative z-0">
        <MapWrapper villages={villages} />
      </div>
    </main>
  )
}
