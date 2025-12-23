export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    villageId: number;
}

export interface Village {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
}

export type VillageWithProducts = Village & {
    products: Product[]
}
