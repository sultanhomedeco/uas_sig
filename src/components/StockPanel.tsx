'use client'

import { useState } from 'react'
import { addProduct, deleteProduct } from '@/app/actions'
import { X, Trash2, Plus, Box } from 'lucide-react'
import { VillageWithProducts } from '@/types'



export default function StockPanel({ village, onClose }: { village: VillageWithProducts, onClose: () => void }) {
    const [isAdding, setIsAdding] = useState(false)

    return (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl transform transition-transform z-[2000] overflow-hidden flex flex-col border-l border-gray-200">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">{village.name}</h2>
                    <p className="text-sm text-gray-500">Stock Management</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-600">
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {village.products.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        <Box className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                        <p>No products available.</p>
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {village.products.map((p) => (
                            <li key={p.id} className="bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-semibold text-gray-800">{p.name}</h4>
                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{p.category}</span>
                                    </div>
                                    <button
                                        onClick={() => deleteProduct(p.id)}
                                        className="text-red-400 hover:text-red-600 p-1"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="mt-3 flex justify-between items-end text-sm">
                                    <div className="text-gray-600">Stock: <span className="font-mono font-bold text-black">{p.stock}</span></div>
                                    <div className="font-bold text-green-600">Rp {p.price.toLocaleString()}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50">
                {!isAdding ? (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                        <Plus size={20} /> Add New Product
                    </button>
                ) : (
                    <form action={async (formData) => {
                        await addProduct(village.id, formData)
                        setIsAdding(false)
                    }} className="space-y-3 bg-white p-3 rounded-lg border shadow-sm">
                        <h3 className="font-bold text-sm text-gray-700 mb-2">New Product</h3>
                        <input name="name" placeholder="Product Name" required className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                        <input name="category" placeholder="Category" required className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                        <div className="flex gap-2">
                            <input name="stock" type="number" placeholder="Stock" required className="w-1/2 p-2 text-sm border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                            <input name="price" type="number" placeholder="Price (Rp)" required className="w-1/2 p-2 text-sm border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div className="flex gap-2 mt-2">
                            <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-1.5 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200">Cancel</button>
                            <button type="submit" className="flex-1 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
